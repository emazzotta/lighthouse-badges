#!/usr/bin/env node

const { getLighthouseMetrics, metricsToSvg, htmlReportsToFile } = require('../lib/lighthouse-badges');
const { getAverageScore, getSquashedScore } = require('../lib/calculations');
const { parser } = require('../lib/argparser');

(async function () {
  const args = await parser.parseArgs();
  console.log('Lighthouse performance test running... (this might take a while)');
  const results = await Promise.all(
    args.urls.map(url => getLighthouseMetrics(url, args.save_report)),
  );
  const metrics = results.map(result => result.metrics);
  const reports = results.map(result => result.report);
  const metricsResults = args.single_badge === true
    ? await getSquashedScore(metrics) : await getAverageScore(metrics);
  await Promise.all([htmlReportsToFile(reports), metricsToSvg(metricsResults, args.badge_style)]);
}());
