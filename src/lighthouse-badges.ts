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

const badgeFilePath = (outputPath: string, metricKey: string): string =>
  path.join(outputPath, `${metricKey.replace(/ /g, '_')}.svg`);

const buildBadgeSvg = (metricKey: string, score: number, badgeStyle: BadgeStyle): string =>
  makeBadge({
    label: metricKey,
    message: `${score}%`,
    color: percentageToColor(score),
    style: badgeStyle,
  });

const saveBadge = async (
  outputPath: string,
  metricKey: string,
  score: number,
  badgeStyle: BadgeStyle,
): Promise<void> => {
  const filepath = badgeFilePath(outputPath, metricKey);
  await fs.writeFile(filepath, buildBadgeSvg(metricKey, score, badgeStyle));
  process.stdout.write(`Saved svg to ${filepath}\n`);
};

export const metricsToSvg = async (
  lighthouseMetrics: LighthouseMetrics,
  badgeStyle: BadgeStyle,
  outputPath: string,
): Promise<void> => {
  await Promise.all(
    Object.entries(lighthouseMetrics).map(([metricKey, score]) =>
      saveBadge(outputPath, metricKey, score, badgeStyle),
    ),
  );
};

const saveHtmlReport = async (
  outputPath: string,
  url: string,
  htmlContent: string,
): Promise<void> => {
  const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
  await fs.writeFile(filepath, htmlContent);
  process.stdout.write(`Saved report to ${filepath}\n`);
};

export const htmlReportsToFile = async (
  htmlReports: LighthouseReport[],
  outputPath: string,
): Promise<void> => {
  const savePromises = htmlReports.flatMap((report) =>
    Object.entries(report)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([url, content]) => saveHtmlReport(outputPath, url, content)),
  );
  await Promise.all(savePromises);
};

const extractLighthouseMetrics = (categories: LighthouseLHR['categories']): LighthouseMetrics =>
  Object.fromEntries(
    Object.entries(categories).map(([category, { score }]) => [
      `lighthouse ${category.toLowerCase()}`,
      score * 100,
    ]),
  );

export const processRawLighthouseResult = (
  data: LighthouseLHR,
  html: string,
  url: string,
  shouldSaveReport: boolean,
): ProcessedLighthouseResult => ({
  metrics: extractLighthouseMetrics(data.categories),
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
  parserArgs: ParsedArgs,
  calculateFn: CalculateLighthouseMetricsFn,
  lighthouseParameters: LighthouseConfig = {},
): Promise<void> => {
  const outputPath = parserArgs.output_path ?? process.cwd();
  await fs.mkdir(outputPath, { recursive: true });

  const { metrics, report } = await calculateFn(
    parserArgs.url,
    parserArgs.save_report,
    lighthouseParameters,
  );

  const scoreResults = parserArgs.single_badge
    ? getSquashedScore([metrics])
    : getAverageScore([metrics]);

  await Promise.all([
    htmlReportsToFile([report], outputPath),
    metricsToSvg(scoreResults, parserArgs.badge_style, outputPath),
  ]);
};
