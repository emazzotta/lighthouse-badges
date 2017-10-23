#!/usr/bin/env node

const { getLighthouseMetrics, metricsToSvg, htmlReportsToFile } = require('../lib/lighthouse-badges');
const { getAverageScore, getSquashedScore } = require('../lib/calculations');
const { parser } = require('../lib/argparser');

(async function () {
  const args = await parser.parseArgs();
  const promisesToAwait = [];
  for (let i = 0; i < args.urls.length; i += 1) {
    promisesToAwait.push(getLighthouseMetrics(args.urls[i], args.save_report));
  }
  console.log('Lighthouse performance test running... (this might take a while)');
  const results = await Promise.all(promisesToAwait);
  const metrics = results.map(result => result.metrics);
  const reports = results.map(result => result.report);
  const metricsResults = args.single_badge === true ?
    await getSquashedScore(metrics) : await getAverageScore(metrics);
  await Promise.all([htmlReportsToFile(reports), metricsToSvg(metricsResults, args.badge_style)]);
}());
