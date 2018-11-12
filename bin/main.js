#!/usr/bin/env node

const { processParameters, getLighthouseMetrics } = require('../lib/lighthouse-badges');
const { parser } = require('../lib/argparser');


(async () => {
  try {
    const args = await parser.parseArgs();
    process.stdout.write('Lighthouse performance test running... (this might take a while)\n');
    await processParameters(args, getLighthouseMetrics);
    process.stderr.write('Done!\n');
  } catch (err) {
    process.stderr.write(`${err}\n`);
  }
})();
