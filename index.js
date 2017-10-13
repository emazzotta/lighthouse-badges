const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const COLOR_RANGES = {
  95: 'brightgreen',
  90: 'green',
  75: 'yellowgreen',
  60: 'yellow',
  40: 'orange',
  0: 'red',
};

const percentage_to_color = async (percentage) => {
  let highest = 0;
  let color = COLOR_RANGES[0];

  for (let current_color of Object.keys(COLOR_RANGES)) {
    if (percentage >= current_color && current_color >= highest) {
      highest = current_color;
      color = COLOR_RANGES[current_color];
    }
  }

  return color;
};


async function metrics_to_svg(lighthouse_metrics) {
  for (let description of Object.keys(lighthouse_metrics)) {
    const badge_color = await percentage_to_color(lighthouse_metrics[description]);
    const badge_text = [description, Math.round(lighthouse_metrics[description]) + '%'];

    badge.loadFont(path.join(__dirname, 'assets', 'fonts', 'Verdana.ttf'), (err) => {
      badge({text: badge_text, colorscheme: badge_color, template: 'flat'}, (svg, err) => {
        fs.writeFile(path.join(__dirname, description + '.svg'), svg, (err) => {
          if (err) {
            return console.log(err);
          } else {
            return console.log(`Written svg to ${path.join(__dirname, description + '.svg')}`);
          }
        })
      });
    });
  }
}


async function lighthouse_badge(url) {
  const lighthouse_command = `./node_modules/.bin/lighthouse --quiet ${url} --chrome-flags='--headless'`;
  const {stdout} = await exec(lighthouse_command + ' --output=json --output-path=stdout', {maxBuffer: 1024 * 5000});
  let lighthouse_metrics = {};
  for (let element of  JSON.parse(stdout).reportCategories) {
    lighthouse_metrics[`Lighthouse ${element.name}`] = element.score;
  }
  console.log('Finished parsing lighthouse data');
  await metrics_to_svg(lighthouse_metrics)
}


(async function () {
  if (process.argv.length < 3) {
    console.error('Please provide a url to perform lighthouse test')
  } else {
    await lighthouse_badge(process.argv[2]);
  }
})();
