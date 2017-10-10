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
}

const lighthouse_metrics = {
  'Lighthouse Progressive Web App': 90,
  'Lighthouse Performance': 67,
  'Lighthouse Accessibility': 77,
  'Lighthouse Best Practices': 50
}

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


badge.loadFont(path.join(__dirname, 'fonts', 'Verdana.ttf'), (err) => {
  Object.keys(lighthouse_metrics).forEach(description => {
    const svg = get_color_for_percentage(lighthouse_metrics[description]).then(color => {
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

    svg.then((svg) => {
      fs.writeFile(path.join(__dirname, 'badges', description + '.svg'), svg, (err) => {})
    });
  });
});