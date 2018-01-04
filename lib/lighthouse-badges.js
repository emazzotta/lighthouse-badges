const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { percentageToColor } = require('./calculations');
const ReportGeneratorV2 = require('lighthouse/lighthouse-core/report/v2/report-generator');
const exec = promisify(require('child_process').exec);

// Buffer size for stdout, must be big enough to handle lighthouse CLI output
const maxBuffer = 1024 * 50000;


async function metricsToSvg(lighthouseMetrics, badgeStyle) {
  const metricKeys = Object.keys(lighthouseMetrics);
  for (let i = 0; i < metricKeys.length; i += 1) {
    const badgeColor = percentageToColor(lighthouseMetrics[metricKeys[i]]);
    const badgeText = [metricKeys[i], `${lighthouseMetrics[metricKeys[i]]}%`];

    badge.loadFont(path.join(__dirname, '..', 'assets', 'fonts', 'Verdana.ttf'), (err) => {
      if (err) {
        throw err;
      }
      badge({ text: badgeText, colorscheme: badgeColor, template: badgeStyle }, (svg, err) => {
        if (err) {
          throw err;
        }
        const filepath = path.join(process.cwd(), `${metricKeys[i].replace(/ /g, '_')}.svg`);
        fs.writeFile(filepath, svg, (err) => {
          if (err) {
            return console.log(err);
          }
          return console.log(`Saved file to ${filepath}`);
        });
      });
    });
  }
}

async function htmlReportsToFile(htmlReports) {
  for (let i = 0; i < htmlReports.length; i += 1) {
    const report = Object.values(htmlReports[i])[0];
    if (report) {
      const url = Object.keys(htmlReports[i])[0];
      const escapedUrl = url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9]/g, '_');
      const filepath = path.join(process.cwd(), `${escapedUrl}.html`);
      fs.writeFile(filepath, report, (err) => {
        if (err) {
          return console.log(err);
        }
        return console.log(`Saved report to ${filepath}`);
      });
    }
  }
}


async function getLighthouseMetrics(url, htmlReportToggle) {
  let htmlReport = false;
  const lighthouseMetrics = {};
  const lighthouseBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse');
  const params = '--chrome-flags=\'--headless\' --output=json --output-path=stdout --quiet';
  const lighthouseCommand = `${lighthouseBinary} ${params} ${url}`;
  try {
    const { stdout } = await exec(`${lighthouseCommand}`, { maxBuffer });
    const results = JSON.parse(stdout);
    if (htmlReportToggle) {
      htmlReport = new ReportGeneratorV2().generateReportHtml(results);
    }
    const { reportCategories } = results;
    for (let i = 0; i < reportCategories.length; i += 1) {
      lighthouseMetrics[`lighthouse ${reportCategories[i].name.toLowerCase()}`] = reportCategories[i].score;
    }
    return { metrics: lighthouseMetrics, report: { [url]: htmlReport } };
  } catch (err) {
    throw err;
  }
}


module.exports = {
  metricsToSvg,
  htmlReportsToFile,
  getLighthouseMetrics,
};
