import fs from 'fs/promises';
import {
  calculateLighthouseMetrics as defaultCalculate,
  prepareOutputPath,
  saveArtifacts as defaultSave,
} from './lighthouse-badges.js';
import { parseArgs as defaultParseArgs } from './argparser.js';
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
  saveArtifacts?: typeof defaultSave;
  calculateLighthouseMetrics?: typeof defaultCalculate;
  parseArgs?: typeof defaultParseArgs;
}

const withSpinner = async <T>(spinner: Spinner, task: () => Promise<T>): Promise<T> => {
  spinner.start();
  try {
    return await task();
  } finally {
    spinner.stop();
  }
};

const handleUserInput = async (spinner: Spinner, deps: Dependencies = {}): Promise<void> => {
  const parseArgs = deps.parseArgs ?? defaultParseArgs;
  const calculate = deps.calculateLighthouseMetrics ?? defaultCalculate;
  const save = deps.saveArtifacts ?? defaultSave;

  try {
    const args = await parseArgs();
    const outputPath = await prepareOutputPath(args);
    const lighthouseParameters = await loadLighthouseConfig();
    const result = await withSpinner(spinner, () => calculate(args.url, args.save_report, lighthouseParameters));
    await save(args, outputPath, result);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    process.stderr.write(`${error}\n`);
    process.exit(1);
  }
};

export default handleUserInput;
