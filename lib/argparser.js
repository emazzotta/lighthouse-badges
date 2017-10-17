#!/usr/bin/env node

const path = require('path');
const { ArgumentParser } = require('argparse');

const { version } = require(path.join(__dirname, '..', 'package.json'));

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

module.exports = {
  parser,
};
