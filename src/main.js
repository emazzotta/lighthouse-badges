import fs from 'fs';
import { calculateLighthouseMetrics, processParameters } from './lighthouse-badges.js';
import parser from './argparser.js';


const handleUserInput = async (spinner) => {
  try {
    spinner.start();
    const parsedArgs = await parser.parse_args();
    let lighthouseParameters = { extends: 'lighthouse:default' };
    if (process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH) {
      process.stdout.write(` LIGHTHOUSE_BADGES_CONFIGURATION_PATH: ${process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH}\n`);
      const fileContent = fs.readFileSync(process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH, 'utf8');
      lighthouseParameters = JSON.parse(fileContent);
    }
    await processParameters(
      parsedArgs,
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
