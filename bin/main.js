#!/usr/bin/env node

const { processParameters, getLighthouseMetrics } = require('../lib/lighthouse-badges');
const { parser } = require('../lib/argparser');


(async () => {
  const args = await parser.parseArgs();
  process.stdout.write('Lighthouse performance test running... (this might take a while)\n');
  processParameters(args, getLighthouseMetrics).then(() => {
    process.stderr.write('Done!\n');
  }).catch((err) => {
    process.stderr.write(`An error occurred! ${err}\n`);
  });
})();
