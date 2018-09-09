const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const exec = promisify(require('child_process').exec);
const { urlEscaper } = require('./util');
const { percentageToColor } = require('./calculations');

// Buffer size for stdout, must be big enough to handle lighthouse CLI output
const maxBuffer = 1024 * 50000;

const metricsToSvg = async (lighthouseMetrics, badgeStyle) => {
  const metricKeys = Object.keys(lighthouseMetrics);
  for (let i = 0; i < metricKeys.length; i += 1) {
    const badgeColor = percentageToColor(lighthouseMetrics[metricKeys[i]]);
    const badgeText = [metricKeys[i], `${lighthouseMetrics[metricKeys[i]]}%`];

    badge.loadFont(path.join(__dirname, '..', 'assets', 'fonts', 'Verdana.ttf'), () => {
      badge({ text: badgeText, colorscheme: badgeColor, template: badgeStyle }, (svg) => {
        const filepath = path.join(process.cwd(), `${metricKeys[i].replace(/ /g, '_')}.svg`);
        fs.writeFile(filepath, svg, () => console.log(`Saved file to ${filepath}`));
      });
    });
  }
};

const htmlReportsToFile = async htmlReports => htmlReports.map((htmlReport) => {
  if (htmlReport) {
    const url = Object.keys(htmlReport)[0];
    const filepath = path.join(process.cwd(), `${urlEscaper(url)}.html`);
    fs.writeFile(filepath, htmlReport[url], () => console.log(`Saved report to ${filepath}`));
    return true;
  }
  return false;
});


const processRawLighthouseResult = async (data, url, htmlReportToggle) => {
  const htmlReport = htmlReportToggle ? ReportGenerator.generateReportHtml(data) : false;
  const { categories } = data;
  const scores = Object.keys(categories).map(category => (
    { [`lighthouse ${category.toLowerCase()}`]: categories[category].score * 100 }
  ));
  const lighthouseMetrics = Object.assign({}, ...scores);
  return { metrics: lighthouseMetrics, report: { [url]: htmlReport } };
};


const getLighthouseMetrics = async (url, htmlReportToggle) => {
  const lighthouseBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse');
  const params = '--chrome-flags=\'--headless\' --output=json --output-path=stdout --quiet';
  const lighthouseCommand = `${lighthouseBinary} ${params} ${url}`;
  const { stdout } = await exec(`${lighthouseCommand}`, { maxBuffer });
  return processRawLighthouseResult(JSON.parse(stdout), url, htmlReportToggle);
};


module.exports = {
  metricsToSvg,
  htmlReportsToFile,
  processRawLighthouseResult,
  getLighthouseMetrics,
};
