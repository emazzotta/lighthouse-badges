import { ArgumentParser } from 'argparse';
import packageJson from '../package.json' with { type: 'json' };
import type { ParsedArgs } from './types.js';

const BADGE_STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];

const createParser = (): ArgumentParser => {
  const parser = new ArgumentParser({
    description: 'Generate gh-badges (shields.io) based on lighthouse performance.',
    add_help: true,
  });

  parser.add_argument('-v', '--version', {
    action: 'version',
    version: packageJson.version,
    help: 'Show the version of the tool',
  });

  parser.add_argument('-s', '--single-badge', {
    action: 'store_true',
    help: "Output only one single badge averaging all lighthouse categories' scores",
  });

  parser.add_argument('-b', '--badge-style', {
    action: 'store',
    choices: BADGE_STYLES,
    default: 'flat',
    help: 'Define look and feel for the badge',
  });

  parser.add_argument('-o', '--output-path', {
    action: 'store',
    help: 'Define output path for artifacts',
  });

  parser.add_argument('-r', '--save-report', {
    action: 'store_true',
    help: 'Save lighthouse report as html for every supplied url',
  });

  const requiredArgs = parser.add_argument_group({ title: 'Required arguments' });
  requiredArgs.add_argument('-u', '--url', {
    action: 'store',
    required: true,
    help: 'The lighthouse badge(s) will contain the score(s) of the supplied url',
  });

  return parser;
};

const parser = createParser();

export default {
  parse_args: (args?: string[]): ParsedArgs => parser.parse_args(args) as unknown as ParsedArgs,
};
