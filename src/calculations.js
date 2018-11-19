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

const getSquashedScore = async metrics => ({
  lighthouse: Math.round(
    metrics.map(
      metric => Object.values(metric).reduce((a, b) => a + b, 0),
    ).reduce((a, b) => a + b, 0) / (metrics.length * Object.keys(metrics[0]).length),
  ),
});

module.exports = {
  percentageToColor,
  getAverageScore,
  getSquashedScore,
};
