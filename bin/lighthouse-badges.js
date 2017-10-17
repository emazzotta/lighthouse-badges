#!/usr/bin/env node


const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { percentageToColor, getAverageScore } = require('../lib/calculations');
const { parser } = require('../lib/argparser');
const exec = util.promisify(require('child_process').exec);

// Buffer size for stdout, must be big enough to handle lighthouse CLI output
const maxBuffer = 1024 * 5000;


async function metricsToSvg(lighthouseMetrics) {
  const metricKeys = Object.keys(lighthouseMetrics);
  for (let i = 0; i < metricKeys.length; i += 1) {
    const badgeColor = percentageToColor(lighthouseMetrics[metricKeys[i]]);
    const badgeText = [metricKeys[i], `${Math.round(lighthouseMetrics[metricKeys[i]])}%`];

    badge.loadFont(path.join(__dirname, '..', 'assets', 'fonts', 'Verdana.ttf'), (err) => {
      if (err) {
        throw err;
      }
      badge({ text: badgeText, colorscheme: badgeColor, template: 'flat' }, (svg, err) => {
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


async function getLighthouseReport(url) {
  const lighthouseMetrics = {};
  const lighthouseCommand = `
      ${path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse')} --quiet ${url} --chrome-flags='--headless'`;

  const { stdout } = await exec(`${lighthouseCommand} --output=json --output-path=stdout`, { maxBuffer });
  const { reportCategories } = JSON.parse(stdout);
  for (let i = 0; i < reportCategories.length; i += 1) {
    lighthouseMetrics[`lighthouse ${reportCategories[i].name.toLowerCase()}`] = reportCategories[i].score;
  }
  return lighthouseMetrics;
}


(async function () {
  const args = parser.parseArgs();
  console.dir(args);
  console.log('Lighthouse performance test running... (this might take a while)');
  const promisesToAwait = [];
  for (let i = 2; i < process.argv.length; i += 1) {
    promisesToAwait.push(getLighthouseReport(process.argv[i]));
  }
  const metrics = await Promise.all(promisesToAwait);
  await metricsToSvg(await getAverageScore(metrics));
}());
