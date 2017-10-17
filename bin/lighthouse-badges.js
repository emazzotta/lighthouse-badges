#!/usr/bin/env node

const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { percentageToColor, getAverageScore, getSquashedScore } = require('../lib/calculations');
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


async function getLighthouseMetrics(url) {
  const lighthouseMetrics = {};
  const lighthouseBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse');
  const lighthouseCommand = `${lighthouseBinary} --quiet ${url} --chrome-flags='--headless'`;
  try {
    const { stdout } = await exec(`${lighthouseCommand} --output=json --output-path=stdout`, { maxBuffer });
    const { reportCategories } = JSON.parse(stdout);
    for (let i = 0; i < reportCategories.length; i += 1) {
      lighthouseMetrics[`lighthouse ${reportCategories[i].name.toLowerCase()}`] = reportCategories[i].score;
    }
    return lighthouseMetrics;
  } catch (err) {
    throw err;
  }
}


(async function () {
  const args = await parser.parseArgs();
  const promisesToAwait = [];
  for (let i = 0; i < args.urls.length; i += 1) {
    promisesToAwait.push(getLighthouseMetrics(args.urls[i]));
  }
  console.log('Lighthouse performance test running... (this might take a while)');
  const metrics = await Promise.all(promisesToAwait);
  const metricsResults = args.single_badge === true ?
    await getSquashedScore(metrics) : await getAverageScore(metrics);
  await metricsToSvg(metricsResults);
}());
