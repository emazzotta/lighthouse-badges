#!/usr/bin/env node

const CLI = require('clui');
const { processParameters, calculateLighthouseMetrics } = require('./lighthouse-badges');
const { parser } = require('./argparser');


const handleUserInput = async () => {
  try {
    const spinner = new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟']);
    spinner.start();
    await processParameters(await parser.parseArgs(), calculateLighthouseMetrics);
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
