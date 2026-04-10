import fs from 'fs/promises';
import {
  calculateLighthouseMetrics as defaultCalculate,
  processParameters as defaultProcess,
} from './lighthouse-badges.js';
import parser from './argparser.js';
import type { Spinner, LighthouseConfig } from './types.js';

const DEFAULT_LIGHTHOUSE_CONFIG: LighthouseConfig = { extends: 'lighthouse:default' };

const loadLighthouseConfig = async (): Promise<LighthouseConfig> => {
  const configPath = process.env.LIGHTHOUSE_BADGES_CONFIGURATION_PATH;
  if (!configPath) return DEFAULT_LIGHTHOUSE_CONFIG;

  process.stdout.write(`LIGHTHOUSE_BADGES_CONFIGURATION_PATH: ${configPath}\n`);

  try {
    return JSON.parse(await fs.readFile(configPath, 'utf8')) as LighthouseConfig;
  } catch (error) {
    throw new Error(`Failed to load Lighthouse configuration from ${configPath}`, { cause: error });
  }
};

interface Dependencies {
  processParameters?: typeof defaultProcess;
  calculateLighthouseMetrics?: typeof defaultCalculate;
  parseArgs?: typeof parser.parse_args;
}

const handleUserInput = async (spinner: Spinner, deps: Dependencies = {}): Promise<void> => {
  const parseArgs = deps.parseArgs ?? parser.parse_args;
  const calculate = deps.calculateLighthouseMetrics ?? defaultCalculate;
  const runProcess = deps.processParameters ?? defaultProcess;

  spinner.start();
  try {
    const args = await parseArgs();
    const lighthouseParameters = await loadLighthouseConfig();
    await runProcess(args, calculate, lighthouseParameters);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    process.stderr.write(`${error}\n`);
    process.exit(1);
  } finally {
    spinner.stop();
  }
};

export default handleUserInput;
