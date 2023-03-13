import { makeBadge } from 'badge-maker';
import path from 'path';
import fs from 'fs';
import * as R from 'ramda';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse/core/index.cjs';
import { statusMessage, urlEscaper } from './util';
import { getAverageScore, getSquashedScore, percentageToColor } from './calculations';

export const metricsToSvg = async (lighthouseMetrics, badgeStyle, outputPath) => {
  R.keys(lighthouseMetrics).map((lighthouseMetricKey) => {
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

export const htmlReportsToFile = async (htmlReports, outputPath) => htmlReports.map((report) => {
  const url = R.head(R.keys(report));
  if (report[url]) {
    const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
    fs.writeFile(filepath, report[url], (error) => statusMessage(
      `Saved report to ${filepath}\n`,
      `Failed to save report to ${outputPath}`,
      error,
    ));
  }
  return false;
});

const generateArtifacts = async ({ reports, svg, outputPath }) => {
  await Promise.all([
    htmlReportsToFile(reports, outputPath),
    metricsToSvg(svg.results, svg.style, outputPath),
  ]);
};

export const processRawLighthouseResult = async (data, html, url, shouldSaveReport) => {
  const htmlReport = shouldSaveReport ? html : false;
  const { categories } = data;
  const scores = R.keys(categories).map((category) => (
    { [`lighthouse ${category.toLowerCase()}`]: categories[category].score * 100 }
  ));
  const lighthouseMetrics = Object.assign({}, ...scores);
  return { metrics: lighthouseMetrics, report: { [url]: htmlReport } };
};

export const calculateLighthouseMetrics = async (
  url,
  shouldSaveReport,
  lighthouseParameters = {},
) => {
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
  const options = { logLevel: 'silent', output: 'html', port: chrome.port };
  const runnerResult = await lighthouse(url, options, lighthouseParameters);
  const reportHtml = runnerResult.report;
  const reportJson = runnerResult.lhr;
  await chrome.kill();

  return processRawLighthouseResult(reportJson, reportHtml, url, shouldSaveReport);
};

export const processParameters = async (parserArgs, func, lighthouseParameters = {}) => {
  const outputPath = parserArgs.output_path || process.cwd();

  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const results = await Promise.all(parserArgs.urls.map(
    (url) => func(url, parserArgs.save_report, lighthouseParameters),
  ));

  const metrics = R.pluck('metrics', results);
  const reports = R.pluck('report', results);

  const metricsResults = parserArgs.single_badge
    ? await getSquashedScore(metrics)
    : await getAverageScore(metrics);

  await generateArtifacts({
    reports,
    svg: { results: metricsResults, style: parserArgs.badge_style },
    outputPath,
  });
};
