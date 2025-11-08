import fs from 'fs';
import { calculateLighthouseMetrics, processParameters } from './lighthouse-badges.js';
import parser from './argparser.js';
import type { Spinner, LighthouseConfig } from './types.js';

const readFileAsync = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const DEFAULT_LIGHTHOUSE_CONFIG: LighthouseConfig = {
  extends: 'lighthouse:default',
};

const loadLighthouseConfig = async (): Promise<LighthouseConfig> => {
  const configPath = process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH;
  if (!configPath) {
    return DEFAULT_LIGHTHOUSE_CONFIG;
  }

  process.stdout.write(` LIGHTHOUSE_BADGES_CONFIGURATION_PATH: ${configPath}\n`);

  try {
    const fileContent = await readFileAsync(configPath);
    return JSON.parse(fileContent) as LighthouseConfig;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load Lighthouse configuration from ${configPath}: ${errorMessage}`);
  }
};

const handleUserInput = async (spinner: Spinner): Promise<void> => {
  try {
    spinner.start();
    const parsedArgs = await parser.parse_args();
    const lighthouseParameters = await loadLighthouseConfig();

    await processParameters(parsedArgs, calculateLighthouseMetrics, lighthouseParameters);

    spinner.stop();
  } catch (err) {
    spinner.stop();
    const error = err instanceof Error ? err : new Error(String(err));
    process.stderr.write(`${error}\n`);
    process.exit(1);
  }
};

export default handleUserInput;
