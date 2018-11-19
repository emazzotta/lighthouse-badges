#!/usr/bin/env node

const CLI = require('clui');
const { processParameters, getLighthouseMetrics } = require('./lighthouse-badges');
const { parser } = require('./argparser');


const handleUserInput = async () => {
  try {
    const args = await parser.parseArgs();
    const text = 'Running Lighthouse, please wait';
    const spinner = new CLI.Spinner(`${text}   `, ['◜', '◠', '◝', '◞', '◡', '◟']);
    spinner.start();
    let dotCounter = 0;
    const intervalId = setInterval(() => {
      const maxDots = 3;
      dotCounter = (dotCounter % maxDots) + 1;
      spinner.message(`${text}${'.'.repeat(dotCounter)}${' '.repeat(maxDots - dotCounter)}`);
    }, 1000);
    await processParameters(args, getLighthouseMetrics);
    clearInterval(intervalId);
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
