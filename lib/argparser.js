#!/usr/bin/env node

const { ArgumentParser, Const } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
  version,
  addHelp: true,
  description: 'A simple npm package to generate gh-badges (shields.io) based on lighthouse performance.',
});

parser.addArgument(
  ['-s', '--single-badge'], {
    action: 'storeFalse',
    help: 'Only output one single badge averaging the four lighthouse scores',
  },
);

let required_args = parser.addArgumentGroup({title: 'required arguments'});
required_args.addArgument(
  ['-u', '--urls'], {
    action: 'store',
    required: true,
    nargs: Const.ONE_OR_MORE,
    help: 'the lighthouse badge(s) will contain the respective average score(s) of all the urls supplied, combined',
  },
);

module.exports = {
  parser,
};
