const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const color_ranges = {
  95: 'brightgreen',
  90: 'green',
  75: 'yellowgreen',
  60: 'yellow',
  40: 'orange',
  0: 'red',
};

const get_color_for_percentage = async (percentage) => {
  let highest = 0;
  let color = color_ranges[0];

  Object.keys(color_ranges).forEach(element => {
    if (percentage >= element && element >= highest) {
      highest = element;
      color = color_ranges[element];
    }
  });

  return color;
};

async function metrics_to_svg(lighthouse_metrics) {
  for (let description of Object.keys(lighthouse_metrics)) {
    const badge_color = await get_color_for_percentage(lighthouse_metrics[description]);

    badge({
      text: [description, Math.round(lighthouse_metrics[description]) + '%'],
      colorscheme: badge_color,
      template: "flat"
    }, (svg, err) => {
      fs.writeFile(path.join(__dirname, 'assets', 'badges', description + '.svg'), svg, (err) => {
      })
    });
  }
}

badge.loadFont(path.join(__dirname, 'assets', 'fonts', 'Verdana.ttf'), (err) => {
  const report_reader = (cb) => {
    fs.readFile(path.join(__dirname, 'report.report.json'), 'utf8', (err, data) => {
      let lighthouse_metrics = {};
      JSON.parse(data).reportCategories.forEach((element) => {
        lighthouse_metrics[`Lighthouse ${element.name}`] = element.score;
        console.log(lighthouse_metrics)
      });
      cb(lighthouse_metrics)
    });
  };

  report_reader(metrics_to_svg)
});



// async function lighthouse_badge() {
//   const { stdout } = await exec('ls');
//
//   console.log('stdout:', stdout);
// }
//
// lighthouse_badge();

// ./node_modules/.bin/lighthouse --output=json --quiet https://siroop.ch --chrome-flags='--headless' --output json --output-path ./report.json
