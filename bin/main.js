#!/usr/bin/env node

const { processParameters, getLighthouseMetrics } = require('../lib/lighthouse-badges');
const { parser } = require('../lib/argparser');


(async () => {
  const args = await parser.parseArgs();
  console.log('Lighthouse performance test running... (this might take a while)');
  await processParameters(args, getLighthouseMetrics);
})();
