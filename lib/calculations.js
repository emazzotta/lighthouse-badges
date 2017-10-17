#!/usr/bin/env node


const { colorRanges } = require('../lib/config');

function percentageToColor(percentage) {
  let highest = 0;
  let color = colorRanges[0];
  const colorKeys = Object.keys(colorRanges);
  for (let i = 0; i < colorKeys.length; i += 1) {
    if (percentage >= colorKeys[i] && colorKeys[i] >= highest) {
      highest = colorKeys[i];
      color = colorRanges[colorKeys[i]];
    }
  }
  return color;
}


async function getAverageScore(metrics) {
  const lighthouseMetrics = {};
  const metricNames = Object.keys(metrics[0]);
  for (let i = 0; i < metricNames.length; i += 1) {
    let times = 0;
    let total = 0;
    for (; times < metrics.length; times += 1) {
      total += metrics[times][metricNames[i]];
    }
    lighthouseMetrics[metricNames[i]] = total / times;
  }
  return lighthouseMetrics;
}

async function getSquashedScore(metrics) {
  const metricNames = Object.keys(metrics[0]);
  let count = 0;
  let total = 0;
  for (let i = 0; i < metricNames.length; i += 1) {
    for (let times = 0; times < metrics.length; times += 1) {
      count += 1;
      total += metrics[times][metricNames[i]];
    }
  }
  return { lighthouse: total / count };
}

module.exports = {
  percentageToColor,
  getAverageScore,
  getSquashedScore,
};
