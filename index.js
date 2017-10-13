const badge = require('gh-badges');
const path = require('path');
const fs = require('fs');

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

const metrics_to_svg = (lighthouse_metrics) => {
  Object.keys(lighthouse_metrics).forEach(description => {
    const generated_svg = get_color_for_percentage(lighthouse_metrics[description]).then(color => {
      return new Promise((res, err) => {
        badge({
          text: [description, lighthouse_metrics[description] + '%'],
          colorscheme: color,
          template: "flat"
        }, (svg, err) => {
          return res(svg);
        });
      });
    });

    generated_svg.then((svg) => {
      fs.writeFile(path.join(__dirname, 'badges', description + '.svg'), svg, (err) => {
      })
    });
  });
};

badge.loadFont(path.join(__dirname, 'fonts', 'Verdana.ttf'), (err) => {
  const report_reader = (cb) => {
    fs.readFile(path.join(__dirname, 'myfile.report.json'), 'utf8', (err, data) => {
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

