import fs from 'fs';
import { calculateLighthouseMetrics, processParameters } from './lighthouse-badges.js';
import parser from './argparser.js';
import type { Spinner, LighthouseConfig } from './types.js';

const handleUserInput = async (spinner: Spinner): Promise<void> => {
  try {
    spinner.start();
    const parsedArgs = await parser.parse_args();
    let lighthouseParameters: LighthouseConfig = { extends: 'lighthouse:default' };
    if (process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH) {
      process.stdout.write(` LIGHTHOUSE_BADGES_CONFIGURATION_PATH: ${process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH}\n`);
      const fileContent = fs.readFileSync(process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH, 'utf8');
      lighthouseParameters = JSON.parse(fileContent) as LighthouseConfig;
    }
    await processParameters(
      parsedArgs,
      calculateLighthouseMetrics,
      lighthouseParameters,
    );
    spinner.stop();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    process.stderr.write(`${error}\n`);
    process.exit(1);
  }
};

export default handleUserInput;

