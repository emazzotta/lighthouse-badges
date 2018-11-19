#!/usr/bin/env node

const CLI = require('clui');
const { processParameters, getLighthouseMetrics } = require('../lib/lighthouse-badges');
const { parser } = require('../lib/argparser');

const handleUserInput = async () => {
  try {
    const args = await parser.parseArgs();
    const spinner = new CLI.Spinner('Running lighthouse, please wait...', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    spinner.start();
    await processParameters(args, getLighthouseMetrics);
    spinner.stop();
  } catch (err) {
    process.stderr.write(`${err}\n`);
  }
};

(handleUserInput)();

module.exports = {
  handleUserInput,
};
