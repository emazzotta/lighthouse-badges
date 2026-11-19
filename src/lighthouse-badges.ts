import path from 'path';
import fs from 'fs/promises';
import { makeBadge } from 'badge-maker';
import type { Flags } from 'lighthouse';
import { urlEscaper } from './util.js';
import { squashScores, percentageToColor } from './calculations.js';
import type {
  HtmlReport,
  LighthouseMetrics,
  ProcessedLighthouseResult,
  LighthouseConfig,
  LighthouseLHR,
  LighthouseCategory,
  ParsedArgs,
  BadgeStyle,
} from './types.js';

const CHROME_FLAGS: readonly string[] = ['--headless', '--disable-gpu', '--disable-dev-shm-usage'];

export const buildChromeFlags = (env: NodeJS.ProcessEnv = process.env): string[] =>
  env.LIGHTHOUSE_BADGES_DISABLE_SANDBOX === 'true' ? [...CHROME_FLAGS, '--no-sandbox'] : [...CHROME_FLAGS];

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

export const saveHtmlReport = async (outputPath: string, { url, html }: HtmlReport): Promise<void> => {
  const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
  await fs.writeFile(filepath, html);
  process.stdout.write(`Saved report to ${filepath}\n`);
};

type CategoryEntry = [string, LighthouseCategory];
type ScoredCategoryEntry = [string, LighthouseCategory & { score: number }];

const isScored = (entry: CategoryEntry): entry is ScoredCategoryEntry => entry[1].score !== null;

const categoriesToPercentages = (categories: Record<string, LighthouseCategory>, url: string): LighthouseMetrics => {
  const entries = Object.entries(categories);
  if (entries.length === 0) {
    throw new Error(`Lighthouse returned no categories for ${url}`);
  }
  const scored = entries.filter(isScored);
  if (scored.length < entries.length) {
    const unscored = entries.filter((entry) => !isScored(entry)).map(([category]) => category);
    throw new Error(`Lighthouse returned no score for ${url} in: ${unscored.join(', ')}`);
  }
  return Object.fromEntries(
    scored.map(([category, { score }]) => [`lighthouse ${category.toLowerCase()}`, Math.round(score * 100)]),
  );
};

export const processRawLighthouseResult = (
  lhr: LighthouseLHR,
  html: string,
  url: string,
  shouldSaveReport: boolean,
): ProcessedLighthouseResult => {
  if (lhr.runtimeError) {
    const { code, message } = lhr.runtimeError;
    throw new Error(`Lighthouse could not audit ${url} (${code}): ${message}`);
  }
  return {
    metrics: categoriesToPercentages(lhr.categories, url),
    ...(shouldSaveReport ? { report: { url, html } } : {}),
  };
};

export const buildLighthouseFlags = (port: number, shouldSaveReport: boolean): Flags => ({
  logLevel: 'silent',
  output: shouldSaveReport ? 'html' : 'json',
  port,
});

type CalculateLighthouseMetricsFn = (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters: LighthouseConfig,
) => Promise<ProcessedLighthouseResult>;

export const calculateLighthouseMetrics: CalculateLighthouseMetricsFn = async (
  url,
  shouldSaveReport,
  lighthouseParameters,
) => {
  const { launch } = await import('chrome-launcher');
  const { default: lighthouse } = await import('lighthouse');
  const chrome = await launch({ chromeFlags: buildChromeFlags() });

  try {
    const runnerResult = await lighthouse(url, buildLighthouseFlags(chrome.port, shouldSaveReport), lighthouseParameters);
    if (!runnerResult) {
      throw new Error(`Lighthouse returned no result for ${url}`);
    }
    const { lhr, report } = runnerResult;
    return processRawLighthouseResult(lhr, [report].flat().join(''), url, shouldSaveReport);
  } finally {
    await chrome.kill();
  }
};

export const resolveOutputPath = (args: ParsedArgs): string => args.output_path ?? process.cwd();

export const saveArtifacts = async (args: ParsedArgs, { metrics, report }: ProcessedLighthouseResult): Promise<void> => {
  const outputPath = resolveOutputPath(args);
  await fs.mkdir(outputPath, { recursive: true });
  const scores = args.single_badge ? squashScores(metrics) : metrics;

  await Promise.all([
    report ? saveHtmlReport(outputPath, report) : Promise.resolve(),
    metricsToSvg(scores, args.badge_style, outputPath),
  ]);
};
