#!/usr/bin/env node

import fs from 'fs';
import CLI from 'clui';
import { calculateLighthouseMetrics, processParameters } from './lighthouse-badges';
import parser from './argparser';

const CLI_SPINNER = new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟']);

const handleUserInput = async (spinner) => {
  try {
    spinner.start();
    let lighthouseParameters = { extends: 'lighthouse:default' };
    if (process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH) {
      process.stdout.write(` LIGHTHOUSE_BADGES_CONFIGURATION_PATH: ${process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH}\n`);
      const fileContent = fs.readFileSync(process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH, 'utf8');
      lighthouseParameters = JSON.parse(fileContent);
    }
    await processParameters(
      await parser.parse_args(),
      calculateLighthouseMetrics,
      lighthouseParameters,
    );
    spinner.stop();
  } catch (err) {
    process.stderr.write(`${err}\n`);
    process.exit(1);
  }
};

export default handleUserInput;

// Only self-invoke if not imported but called directly as executable
(() => !module.parent && handleUserInput(CLI_SPINNER))();
