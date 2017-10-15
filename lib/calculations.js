const {color_ranges} = require('../lib/config');

async function percentage_to_color(percentage) {
  let highest = 0;
  let color = color_ranges[0];

  for (let current_color of Object.keys(color_ranges)) {
    if (percentage >= current_color && current_color >= highest) {
      highest = current_color;
      color = color_ranges[current_color];
    }
  }

  return color;
}


async function get_average_score(metrics) {
  let lighthouse_metrics = {};
  for (let metric of Object.keys(metrics[0])) {
    let i = 0;
    let total = 0;
    for (; i < metrics.length; i++) {
      total += metrics[i][metric];
    }
    lighthouse_metrics[metric] = total / i;
  }
  return lighthouse_metrics;
}

module.exports = {
  percentage_to_color,
  get_average_score
};