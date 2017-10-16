const { colorRanges } = require('../lib/config');

function percentageToColor(percentage) {
  let highest = 0;
  let color = colorRanges[0];

  for (const currentColor of Object.keys(colorRanges)) {
    if (percentage >= currentColor && currentColor >= highest) {
      highest = currentColor;
      color = colorRanges[currentColor];
    }
  }

  return color;
}


async function getAverageScore(metrics) {
  const lighthouseMetrics = {};
  for (const metric of Object.keys(metrics[0])) {
    let i = 0;
    let total = 0;
    for (; i < metrics.length; i += 1) {
      total += metrics[i][metric];
    }
    lighthouseMetrics[metric] = total / i;
  }
  return lighthouseMetrics;
}

module.exports = {
  percentageToColor,
  getAverageScore,
};
