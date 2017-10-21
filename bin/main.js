#!/usr/bin/env node

const { getLighthouseMetrics, metricsToSvg } = require('../lib/lighthouse-badges');
const { getAverageScore, getSquashedScore } = require('../lib/calculations');
const { parser } = require('../lib/argparser');

(async function () {
  const args = await parser.parseArgs();
  const promisesToAwait = [];
  for (let i = 0; i < args.urls.length; i += 1) {
    promisesToAwait.push(getLighthouseMetrics(args.urls[i]));
  }
  console.log('Lighthouse performance test running... (this might take a while)');
  const metrics = await Promise.all(promisesToAwait);
  const metricsResults = args.single_badge === true ?
    await getSquashedScore(metrics) : await getAverageScore(metrics);
  await metricsToSvg(metricsResults);
}());
