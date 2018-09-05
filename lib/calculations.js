const colorRanges = {
  95: 'brightgreen',
  90: 'green',
  75: 'yellowgreen',
  60: 'yellow',
  40: 'orange',
  0: 'red',
};

const percentageToColor = (percentage) => {
  while(!(percentage in colorRanges)) {
    percentage -= 1;
  }
  return colorRanges[percentage];
};


const getAverageScore = async (metrics) => {
  const lighthouseMetrics = {};
  const metricNames = Object.keys(metrics[0]);
  for (let i = 0; i < metricNames.length; i += 1) {
    let times = 0;
    let total = 0;
    for (; times < metrics.length; times += 1) {
      total += metrics[times][metricNames[i]];
    }
    lighthouseMetrics[metricNames[i]] = Math.round(total / times);
  }
  return lighthouseMetrics;
};

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
