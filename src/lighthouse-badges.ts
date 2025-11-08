import path from 'path';
import fs from 'fs';
import { makeBadge } from 'badge-maker';
import * as R from 'ramda';
import lighthouse from 'lighthouse/core/index.cjs';
import { statusMessage, urlEscaper } from './util.js';
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

const writeFileAsync = (filepath: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const mkdirAsync = (dirPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const CHROME_FLAGS = [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-default-apps',
] as const;

const createBadgeFilePath = (outputPath: string, metricKey: string): string => {
  const sanitizedKey = metricKey.replace(/ /g, '_');
  return path.join(outputPath, `${sanitizedKey}.svg`);
};

const createBadge = (
  metricKey: string,
  score: number,
  badgeStyle: BadgeStyle,
): string => {
  const color = percentageToColor(score);
  return makeBadge({
    label: metricKey,
    message: `${score}%`,
    color,
    style: badgeStyle,
  });
};

const saveBadge = async (
  outputPath: string,
  metricKey: string,
  score: number,
  badgeStyle: BadgeStyle,
): Promise<void> => {
  const filepath = createBadgeFilePath(outputPath, metricKey);
  const svg = createBadge(metricKey, score, badgeStyle);

  try {
    await writeFileAsync(filepath, svg);
    statusMessage(`Saved svg to ${filepath}\n`, `Failed to save svg to ${outputPath}`, null);
  } catch (error) {
    statusMessage(
      `Saved svg to ${filepath}\n`,
      `Failed to save svg to ${outputPath}`,
      error as Error,
    );
  }
};

export const metricsToSvg = async (
  lighthouseMetrics: LighthouseMetrics,
  badgeStyle: BadgeStyle,
  outputPath: string,
): Promise<void> => {
  const savePromises = R.keys(lighthouseMetrics).map((metricKey: string) =>
    saveBadge(outputPath, metricKey, lighthouseMetrics[metricKey], badgeStyle),
  );
  await Promise.all(savePromises);
};

const extractUrlFromReport = (report: LighthouseReport): string | null => {
  const urls = R.keys(report);
  return R.head(urls) || null;
};

const saveHtmlReport = async (
  outputPath: string,
  url: string,
  htmlContent: string,
): Promise<void> => {
  const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
  try {
    await writeFileAsync(filepath, htmlContent);
    statusMessage(`Saved report to ${filepath}\n`, `Failed to save report to ${outputPath}`, null);
  } catch (error) {
    statusMessage(
      `Saved report to ${filepath}\n`,
      `Failed to save report to ${outputPath}`,
      error as Error,
    );
  }
};

export const htmlReportsToFile = async (
  htmlReports: LighthouseReport[],
  outputPath: string,
): Promise<void> => {
  const savePromises = htmlReports
    .map((report) => {
      const url = extractUrlFromReport(report);
      if (!url) {
        return null;
      }

      const reportContent = report[url];
      if (typeof reportContent === 'string') {
        return saveHtmlReport(outputPath, url, reportContent);
      }

      return null;
    })
    .filter((promise): promise is Promise<void> => promise !== null);

  await Promise.all(savePromises);
};

interface ArtifactGenerationParams {
  reports: LighthouseReport[];
  svg: {
    results: LighthouseMetrics;
    style: BadgeStyle;
  };
  outputPath: string;
}

const generateArtifacts = async ({
  reports,
  svg,
  outputPath,
}: ArtifactGenerationParams): Promise<void> => {
  await Promise.all([
    htmlReportsToFile(reports, outputPath),
    metricsToSvg(svg.results, svg.style, outputPath),
  ]);
};

const extractLighthouseMetrics = (categories: LighthouseLHR['categories']): LighthouseMetrics => {
  const scores = R.keys(categories).map((category: string) => ({
    [`lighthouse ${category.toLowerCase()}`]: categories[category].score * 100,
  }));
  return Object.assign({}, ...scores) as LighthouseMetrics;
};

export const processRawLighthouseResult = async (
  data: LighthouseLHR,
  html: string,
  url: string,
  shouldSaveReport: boolean,
): Promise<ProcessedLighthouseResult> => {
  const htmlReport = shouldSaveReport ? html : false;
  const lighthouseMetrics = extractLighthouseMetrics(data.categories);

  return {
    metrics: lighthouseMetrics,
    report: { [url]: htmlReport },
  };
};

type CalculateLighthouseMetricsFn = (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters?: LighthouseConfig,
) => Promise<ProcessedLighthouseResult>;

const launchChrome = async () => {
  const chromeLauncher = await import('chrome-launcher');
  return chromeLauncher.launch({ chromeFlags: [...CHROME_FLAGS] });
};

const runLighthouse = async (
  url: string,
  chromePort: number,
  lighthouseParameters: LighthouseConfig,
): Promise<{ report: string; lhr: LighthouseLHR }> => {
  const options = {
    logLevel: 'silent' as const,
    output: 'html' as const,
    port: chromePort,
  };
  return lighthouse(url, options, lighthouseParameters);
};

export const calculateLighthouseMetrics = async (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters: LighthouseConfig = {},
): Promise<ProcessedLighthouseResult> => {
  const chrome = await launchChrome();

  try {
    const runnerResult = await runLighthouse(url, chrome.port, lighthouseParameters);
    return processRawLighthouseResult(
      runnerResult.lhr,
      runnerResult.report,
      url,
      shouldSaveReport,
    );
  } finally {
    await chrome.kill();
  }
};

const ensureOutputDirectory = async (outputPath: string): Promise<void> => {
  try {
    await mkdirAsync(outputPath);
  } catch {
    throw new Error(`Failed to create output directory: ${outputPath}`);
  }
};

const processUrl = async (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters: LighthouseConfig,
  calculateFn: CalculateLighthouseMetricsFn,
): Promise<ProcessedLighthouseResult> => {
  return calculateFn(url, shouldSaveReport, lighthouseParameters);
};

const calculateMetricsResults = async (
  metrics: LighthouseMetrics[],
  useSingleBadge: boolean,
): Promise<LighthouseMetrics> => {
  return useSingleBadge ? getSquashedScore(metrics) : getAverageScore(metrics);
};

export const processParameters = async (
  parserArgs: ParsedArgs,
  func: CalculateLighthouseMetricsFn,
  lighthouseParameters: LighthouseConfig = {},
): Promise<void> => {
  const outputPath = parserArgs.output_path || process.cwd();
  await ensureOutputDirectory(outputPath);

  const results = await Promise.all([
    processUrl(parserArgs.url, parserArgs.save_report, lighthouseParameters, func),
  ]);

  const metrics = R.pluck('metrics', results) as LighthouseMetrics[];
  const reports = R.pluck('report', results) as LighthouseReport[];

  const metricsResults = await calculateMetricsResults(metrics, parserArgs.single_badge);

  await generateArtifacts({
    reports,
    svg: { results: metricsResults, style: parserArgs.badge_style },
    outputPath,
  });
};
