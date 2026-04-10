import path from 'path';
import fs from 'fs/promises';
import { makeBadge } from 'badge-maker';
import lighthouse from 'lighthouse/core/index.cjs';
import { urlEscaper } from './util.js';
import { getAverageScore, getSquashedScore, percentageToColor } from './calculations.js';
import type {
  LighthouseMetrics,
  LighthouseReport,
  ProcessedLighthouseResult,
  LighthouseConfig,
  LighthouseLHR,
  ParsedArgs,
  BadgeStyle,
} from './types.js';

const CHROME_FLAGS = [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-default-apps',
];

const saveBadge = async (
  outputPath: string,
  metricKey: string,
  score: number,
  badgeStyle: BadgeStyle,
): Promise<void> => {
  const filepath = path.join(outputPath, `${metricKey.replace(/ /g, '_')}.svg`);
  const svg = makeBadge({
    label: metricKey,
    message: `${score}%`,
    color: percentageToColor(score),
    style: badgeStyle,
  });
  await fs.writeFile(filepath, svg);
  process.stdout.write(`Saved svg to ${filepath}\n`);
};

export const metricsToSvg = async (
  metrics: LighthouseMetrics,
  badgeStyle: BadgeStyle,
  outputPath: string,
): Promise<void> => {
  await Promise.all(
    Object.entries(metrics).map(([key, score]) => saveBadge(outputPath, key, score, badgeStyle)),
  );
};

const saveHtmlReport = async (outputPath: string, url: string, html: string): Promise<void> => {
  const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
  await fs.writeFile(filepath, html);
  process.stdout.write(`Saved report to ${filepath}\n`);
};

export const htmlReportsToFile = async (
  htmlReports: LighthouseReport[],
  outputPath: string,
): Promise<void> => {
  await Promise.all(
    htmlReports.flatMap((report) =>
      Object.entries(report).flatMap(([url, content]) =>
        typeof content === 'string' ? [saveHtmlReport(outputPath, url, content)] : [],
      ),
    ),
  );
};

export const processRawLighthouseResult = (
  lhr: LighthouseLHR,
  html: string,
  url: string,
  shouldSaveReport: boolean,
): ProcessedLighthouseResult => ({
  metrics: Object.fromEntries(
    Object.entries(lhr.categories).map(([category, { score }]) => [
      `lighthouse ${category.toLowerCase()}`,
      score * 100,
    ]),
  ),
  report: { [url]: shouldSaveReport ? html : false },
});

type CalculateLighthouseMetricsFn = (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters?: LighthouseConfig,
) => Promise<ProcessedLighthouseResult>;

export const calculateLighthouseMetrics: CalculateLighthouseMetricsFn = async (
  url,
  shouldSaveReport,
  lighthouseParameters = {},
) => {
  const { launch } = await import('chrome-launcher');
  const chrome = await launch({ chromeFlags: CHROME_FLAGS });

  try {
    const { lhr, report } = await lighthouse(
      url,
      { logLevel: 'silent', output: 'html', port: chrome.port },
      lighthouseParameters,
    );
    return processRawLighthouseResult(lhr, report, url, shouldSaveReport);
  } finally {
    await chrome.kill();
  }
};

export const processParameters = async (
  args: ParsedArgs,
  calculateFn: CalculateLighthouseMetricsFn,
  lighthouseParameters: LighthouseConfig = {},
): Promise<void> => {
  const outputPath = args.output_path ?? process.cwd();
  await fs.mkdir(outputPath, { recursive: true });

  const { metrics, report } = await calculateFn(args.url, args.save_report, lighthouseParameters);
  const scores = args.single_badge ? getSquashedScore([metrics]) : getAverageScore([metrics]);

  await Promise.all([
    htmlReportsToFile([report], outputPath),
    metricsToSvg(scores, args.badge_style, outputPath),
  ]);
};
