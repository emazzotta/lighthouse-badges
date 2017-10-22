const { ArgumentParser, Const } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
  version,
  addHelp: true,
  description: 'A simple npm package to generate gh-badges (shields.io) based on lighthouse performance.',
});

const requiredArgs = parser.addArgumentGroup({ title: 'Required arguments' });

parser.addArgument(
  ['-s', '--single-badge'], {
    action: 'storeTrue',
    required: false,
    help: 'Only output one single badge averaging the four lighthouse scores',
  },
);

parser.addArgument(
  ['-b', '--badge-style'], {
    action: 'store',
    required: false,
    choices: ['flat', 'flat-square', 'plastic'],
    help: 'Badge style for the svg',
  },
);

requiredArgs.addArgument(
  ['-u', '--urls'], {
    action: 'store',
    required: true,
    nargs: Const.ONE_OR_MORE,
    help: 'The lighthouse badge(s) will contain the respective average score(s) of all the urls supplied, combined',
  },
);

module.exports = {
  parser,
};
