const { BadgeFactory } = require('gh-badges');
const path = require('path');
const fs = require('fs');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const exec = require('util').promisify(require('child_process').exec);
const { getAverageScore, getSquashedScore } = require('./calculations');
const { urlEscaper } = require('./util');
const { percentageToColor } = require('./calculations');

// Buffer size for stdout, must be big enough to handle lighthouse CLI output
const maxBuffer = 1024 * 50000;


const metricsToSvg = async (lighthouseMetrics, template, outputPath) => {
  Object.keys(lighthouseMetrics).map((lighthouseMetricKey) => {
    const fontPath = path.join(__dirname, '..', 'assets', 'fonts', 'Verdana.ttf');
    const filepath = path.join(outputPath, `${lighthouseMetricKey.replace(/ /g, '_')}.svg`);
    const text = [lighthouseMetricKey, `${lighthouseMetrics[lighthouseMetricKey]}%`];
    const colorscheme = percentageToColor(lighthouseMetrics[lighthouseMetricKey]);
    const badgeFactory = new BadgeFactory({ fontPath });
    const svg = badgeFactory.create({ text, colorscheme, template });
    fs.writeFile(filepath, svg, (err) => {
      if (err) {
        throw new Error(`Failed to save svg files to ${outputPath}`);
      }
      process.stdout.write(`Saved svg to ${filepath}\n`);
    });
    return true;
  });
};

const htmlReportsToFile = async (htmlReports, outputPath) => htmlReports.map((htmlReport) => {
  const url = Object.keys(htmlReport)[0];
  if (htmlReport[url]) {
    const filepath = path.join(outputPath, `${urlEscaper(url)}.html`);
    fs.writeFile(filepath, htmlReport[url], (err) => {
      if (err) {
        throw new Error(`Failed to save report to ${outputPath}`);
      }
      return process.stdout.write(`Saved report to ${filepath}\n`);
    });
  }
  return false;
});

const generateArtifacts = async ({ reports, svg, savePath }) => {
  const outputPath = savePath || process.cwd();
  await Promise.all([
    htmlReportsToFile(reports, outputPath),
    metricsToSvg(svg.results, svg.style, outputPath),
  ]);
};

const processRawLighthouseResult = async (data, url, shouldSaveReport) => {
  const htmlReport = shouldSaveReport ? ReportGenerator.generateReportHtml(data) : false;
  const { categories } = data;
  const scores = Object.keys(categories).map(category => (
    { [`lighthouse ${category.toLowerCase()}`]: categories[category].score * 100 }
  ));
  const lighthouseMetrics = Object.assign({}, ...scores);
  return { metrics: lighthouseMetrics, report: { [url]: htmlReport } };
};

const getLighthouseMetrics = async (url, shouldSaveReport) => {
  const lighthouseBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse');
  const params = '--chrome-flags=\'--headless --no-sandbox --no-default-browser-check --no-first-run --disable-default-apps\' --output=json --output-path=stdout --quiet';
  const lighthouseCommand = `${lighthouseBinary} ${params} ${url}`;
  const { stdout } = await exec(`${lighthouseCommand}`, { maxBuffer });
  return processRawLighthouseResult(JSON.parse(stdout), url, shouldSaveReport);
};

const processParameters = async (args, lighthouseMetricFunction) => {
  const results = await Promise.all(args.urls.map(
    url => lighthouseMetricFunction(url, args.save_report),
  ));

  const metrics = results.map(result => result.metrics);
  const reports = results.map(result => result.report);
  const metricsResults = args.single_badge
    ? await getSquashedScore(metrics)
    : await getAverageScore(metrics);

  await generateArtifacts({
    reports,
    svg: { results: metricsResults, style: args.badge_style },
    path: args.output_path,
  });
};


module.exports = {
  metricsToSvg,
  htmlReportsToFile,
  processRawLighthouseResult,
  getLighthouseMetrics,
  processParameters,
};
