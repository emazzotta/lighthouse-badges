#!/usr/bin/env node

import CLI from 'clui';
import { calculateLighthouseMetrics, processParameters } from './lighthouse-badges';
import parser from './argparser';

const handleUserInput = async (spinner) => {
  try {
    spinner.start();
    await processParameters(await parser.parse_args(), calculateLighthouseMetrics);
    spinner.stop();
  } catch (err) {
    process.stderr.write(`${err}\n`);
    process.exit(1);
  }
};

// Only self-invoke if not imported but called directly as executable
(() => !module.parent && handleUserInput(new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟'])))();

export default handleUserInput;
