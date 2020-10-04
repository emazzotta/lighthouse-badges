#!/usr/bin/env node

const CLI = require('clui');
const { processParameters, calculateLighthouseMetrics } = require('./lighthouse-badges');
const { parser } = require('./argparser');

const handleUserInput = async () => {
  try {
    if (process.env.LIGHTHOUSE_BADGES_PARAMS) {
      process.stdout.write(`LIGHTHOUSE_BADGES_PARAMS: ${process.env.LIGHTHOUSE_BADGES_PARAMS}\n`);
    }
    const spinner = new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟']);
    spinner.start();
    await processParameters(await parser.parse_args(), calculateLighthouseMetrics);
    spinner.stop();
  } catch (err) {
    process.stderr.write(`${err}\n`);
    process.exit(1);
  }
};

// Only self-invoke if not imported but called directly as executable
(() => !module.parent && handleUserInput())();

module.exports = {
  handleUserInput,
};
