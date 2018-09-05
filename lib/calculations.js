const colorRanges = {
  95: 'brightgreen',
  90: 'green',
  75: 'yellowgreen',
  60: 'yellow',
  40: 'orange',
  0: 'red',
};

const percentageToColor = (percentage) => {
  let key = percentage;
  while (!(key in colorRanges)) {
    key -= 1;
  }
  return colorRanges[key];
};


const getAverageScore = async metrics => Object.assign({}, ...Object.keys(metrics[0]).map(
  (category) => {
    const categoryScoreSum = metrics.map(metric => metric[category]).reduce((a, b) => a + b, 0);
    return { [category]: Math.round(categoryScoreSum / metrics.length) };
  },
));

const getSquashedScore = async (metrics) => {
  const metricNames = Object.keys(metrics[0]);
  let count = 0;
  let total = 0;
  for (let i = 0; i < metricNames.length; i += 1) {
    for (let times = 0; times < metrics.length; times += 1) {
      count += 1;
      total += metrics[times][metricNames[i]];
    }
  }
  return { lighthouse: Math.round(total / count) };
};

module.exports = {
  percentageToColor,
  getAverageScore,
  getSquashedScore,
};
