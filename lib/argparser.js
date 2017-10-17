#!/usr/bin/env node

const path = require('path');
const { ArgumentParser } = require('argparse');

const { version } = path.join(__dirname, '..', 'package.json');

const parser = new ArgumentParser({
  version,
  addHelp: true,
  description: 'A simple npm package to generate gh-badges (shields.io) based on lighthouse performance.',
});

module.exports = {
  parser,
};
