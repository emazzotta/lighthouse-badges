const { ArgumentParser, Const } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
  version,
  addHelp: true,
  debug: true,
  description: 'Generate gh-badges (shields.io) based on lighthouse performance.',
});

const requiredArgs = parser.addArgumentGroup({ title: 'Required arguments' });

parser.addArgument(['-s', '--single-badge'], {
  action: 'storeTrue',
  required: false,
  help: 'Output only one single badge averaging all lighthouse categories\' scores ',
});

parser.addArgument(['-b', '--badge-style'], {
  action: 'store',
  required: false,
  choices: ['flat', 'flat-square', 'plastic', 'for-the-badge', 'popout', 'popout-square', 'social'],
  defaultValue: 'flat',
  help: 'Define look and feel for the badge',
});

parser.addArgument(['-o', '--output-path'], {
  action: 'store',
  required: false,
  help: 'Define output path for artifacts',
});

parser.addArgument(['-r', '--save-report'], {
  action: 'storeTrue',
  required: false,
  help: 'Save lighthouse report as html for every supplied url',
});

requiredArgs.addArgument(['-u', '--urls'], {
  action: 'store',
  required: true,
  nargs: Const.ONE_OR_MORE,
  help: 'The lighthouse badge(s) will contain the respective average score(s) of all the urls supplied, combined',
});

module.exports = {
  parser,
};
