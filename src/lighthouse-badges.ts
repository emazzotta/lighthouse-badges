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

export const metricsToSvg = async (
  lighthouseMetrics: LighthouseMetrics,
  badgeStyle: BadgeStyle,
  outputPath: string,
): Promise<void> => {
  R.keys(lighthouseMetrics).map((lighthouseMetricKey: string) => {
    const filepath = path.join(outputPath, `${lighthouseMetricKey.replace(/ /g, '_')}.svg`);
    const badgeColor = percentageToColor(lighthouseMetrics[lighthouseMetricKey]);

    const svg = makeBadge({
      label: lighthouseMetricKey,
      message: `${lighthouseMetrics[lighthouseMetricKey]}%`,
      color: badgeColor,
      style: badgeStyle,
    });

    fs.writeFile(filepath, svg, (error) => statusMessage(
      `Saved svg to ${filepath}\n`,
      `Failed to save svg to ${outputPath}`,
      error,
    ));

    return true;
  });
};

export const htmlReportsToFile = async (
  htmlReports: LighthouseReport[],
  outputPath: string,
): Promise<boolean[]> => {
  return htmlReports.map((report) => {
    const url = R.head(R.keys(report)) as string;
    if (report[url]) {
      const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
      const reportContent = report[url];
      if (typeof reportContent === 'string') {
        fs.writeFile(filepath, reportContent, (error) => statusMessage(
          `Saved report to ${filepath}\n`,
          `Failed to save report to ${outputPath}`,
          error,
        ));
      }
    }
    return false;
  });
};

interface ArtifactGenerationParams {
  reports: LighthouseReport[];
  svg: {
    results: LighthouseMetrics;
    style: BadgeStyle;
  };
  outputPath: string;
}

const generateArtifacts = async ({ reports, svg, outputPath }: ArtifactGenerationParams): Promise<void> => {
  await Promise.all([
    htmlReportsToFile(reports, outputPath),
    metricsToSvg(svg.results, svg.style, outputPath),
  ]);
};

export const processRawLighthouseResult = async (
  data: LighthouseLHR,
  html: string,
  url: string,
  shouldSaveReport: boolean,
): Promise<ProcessedLighthouseResult> => {
  const htmlReport = shouldSaveReport ? html : false;
  const { categories } = data;
  const scores = R.keys(categories).map((category: string) => ({
    [`lighthouse ${category.toLowerCase()}`]: categories[category].score * 100
  }));
  const lighthouseMetrics = Object.assign({}, ...scores) as LighthouseMetrics;
  return { metrics: lighthouseMetrics, report: { [url]: htmlReport } };
};

type CalculateLighthouseMetricsFn = (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters?: LighthouseConfig,
) => Promise<ProcessedLighthouseResult>;

export const calculateLighthouseMetrics = async (
  url: string,
  shouldSaveReport: boolean,
  lighthouseParameters: LighthouseConfig = {},
): Promise<ProcessedLighthouseResult> => {
  return await import('chrome-launcher').then(async (chromeLauncher) => {
    const chromeParameters = [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
    ];
    const chrome = await chromeLauncher.launch({ chromeFlags: chromeParameters });
    const options = { logLevel: 'silent' as const, output: 'html' as const, port: chrome.port };
    const runnerResult = await lighthouse(url, options, lighthouseParameters);
    const reportHtml = runnerResult.report;
    const reportJson = runnerResult.lhr;
    await chrome.kill();
    return processRawLighthouseResult(reportJson, reportHtml, url, shouldSaveReport);
  });
};

export const processParameters = async (
  parserArgs: ParsedArgs,
  func: CalculateLighthouseMetricsFn,
  lighthouseParameters: LighthouseConfig = {},
): Promise<void> => {
  const outputPath = parserArgs.output_path || process.cwd();

  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const results = await Promise.all([parserArgs.url].map(
    (url: string) => func(url, parserArgs.save_report, lighthouseParameters),
  ));

  const metrics = R.pluck('metrics', results) as LighthouseMetrics[];
  const reports = R.pluck('report', results) as LighthouseReport[];

  const metricsResults = parserArgs.single_badge
    ? await getSquashedScore(metrics)
    : await getAverageScore(metrics);

  await generateArtifacts({
    reports,
    svg: { results: metricsResults, style: parserArgs.badge_style },
    outputPath,
  });
};

