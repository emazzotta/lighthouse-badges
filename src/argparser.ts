import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ArgumentParser } from 'argparse';
import type { ParsedArgs } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPackageVersion = (): string => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { version: string };
  return packageJson.version;
};

const createParser = (): ArgumentParser => {
  const parser = new ArgumentParser({
    description: 'Generate gh-badges (shields.io) based on lighthouse performance.',
    add_help: true,
  });

  addVersionArgument(parser);
  addOptionalArguments(parser);
  addRequiredArguments(parser);

  return parser;
};

const addVersionArgument = (parser: ArgumentParser): void => {
  parser.add_argument('-v', '--version', {
    action: 'version',
    version: getPackageVersion(),
    help: 'Show the version of the tool',
  });
};

const addOptionalArguments = (parser: ArgumentParser): void => {
  parser.add_argument('-s', '--single-badge', {
    action: 'store_true',
    required: false,
    help: 'Output only one single badge averaging all lighthouse categories\' scores',
  });

  parser.add_argument('-b', '--badge-style', {
    action: 'store',
    required: false,
    choices: ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'],
    default: 'flat',
    help: 'Define look and feel for the badge',
  });

  parser.add_argument('-o', '--output-path', {
    action: 'store',
    required: false,
    help: 'Define output path for artifacts',
  });

  parser.add_argument('-r', '--save-report', {
    action: 'store_true',
    required: false,
    help: 'Save lighthouse report as html for every supplied url',
  });
};

const addRequiredArguments = (parser: ArgumentParser): void => {
  const requiredArgs = parser.add_argument_group({ title: 'Required arguments' });
  requiredArgs.add_argument('-u', '--url', {
    action: 'store',
    required: true,
    help: 'The lighthouse badge(s) will contain the score(s) of the supplied url',
  });
};

const parser = createParser();

const typedParser = {
  parse_args: (args?: string[]): ParsedArgs => {
    return parser.parse_args(args) as unknown as ParsedArgs;
  },
};

export default typedParser;
