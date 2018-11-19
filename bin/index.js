#!/usr/bin/env node

const { processParameters, getLighthouseMetrics } = require('../lib/lighthouse-badges');
const { parser } = require('../lib/argparser');

const handleUserInput = async () => {
  try {
    const args = await parser.parseArgs();
    process.stdout.write('Running lighthouse tests... (this might take a while)\n');
    await processParameters(args, getLighthouseMetrics);
    process.stdout.write('Done!\n');
  } catch (err) {
    process.stderr.write(`${err}\n`);
  }
};

(handleUserInput)();

module.exports = {
  handleUserInput,
};
