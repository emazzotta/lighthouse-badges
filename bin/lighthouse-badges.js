#!/usr/bin/env node

const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {percentage_to_color, get_average_score} = require('../lib/calculations');
const exec = util.promisify(require('child_process').exec);


async function metrics_to_svg(lighthouse_metrics) {
  for (let description of Object.keys(lighthouse_metrics)) {
    const badge_color = await percentage_to_color(lighthouse_metrics[description]);
    const badge_text = [description, Math.round(lighthouse_metrics[description]) + '%'];

    badge.loadFont(path.join(__dirname, 'assets', 'fonts', 'Verdana.ttf'), (err) => {
      badge({text: badge_text, colorscheme: badge_color, template: 'flat'}, (svg, err) => {
        fs.writeFile(path.join(process.cwd(), description.replace(/ /g, "_") + '.svg'), svg, (err) => {
          if (err) {
            return console.log(err);
          }
        })
      });
    });
  }
}


async function get_lighthouse_score(url) {
  const lighthouse_command = `${path.join(__dirname, '..', 'node_modules', '.bin', 'lighthouse')} --quiet ${url} --chrome-flags='--headless'`;
  const {stdout} = await exec(lighthouse_command + ' --output=json --output-path=stdout', {maxBuffer: 1024 * 5000});
  let lighthouse_metrics = {};
  for (let element of  JSON.parse(stdout).reportCategories) {
    lighthouse_metrics[`Lighthouse ${element.name}`] = element.score;
  }
  return lighthouse_metrics
}


(async function () {
  if (process.argv.length < 3) {
    console.error('Please provide a url to perform lighthouse test');
  } else {
    let metrics = [];
    for (let i = 2; i < process.argv.length; i++) {
      metrics.push(await get_lighthouse_score(process.argv[i]));
    }
    await metrics_to_svg(await get_average_score(metrics))
  }
})();
