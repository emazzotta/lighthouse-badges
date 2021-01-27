[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fc68a4ca6fb648749134e43db5b34678)](https://app.codacy.com/app/emazzotta/lighthouse-badges?utm_source=github.com&utm_medium=referral&utm_content=emazzotta/lighthouse-badges&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/emazzotta/lighthouse-badges.svg?branch=master)](https://travis-ci.org/emazzotta/lighthouse-badges)
[![Code Coverage](https://codecov.io/gh/emazzotta/lighthouse-badges/branch/master/graph/badge.svg)](https://travis-ci.org/emazzotta/lighthouse-badges)
[![Dependencies](https://david-dm.org/emazzotta/lighthouse-badges.svg?style=flat)](https://david-dm.org/emazzotta/lighthouse-badges)
[![NPM version](https://img.shields.io/npm/v/lighthouse-badges.svg)](https://www.npmjs.org/package/lighthouse-badges)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://emanuelemazzotta.com/mit-license) 

# Lighthouse Badges

[![Lighthouse](./assets/img/lighthouse.svg)](https://github.com/GoogleChrome/lighthouse)

This package allows you to easily create Lighthouse badges for all Lighthouse categories.  
Ever wanted to brag about your sites's awesome Lighthouse performance? Then this is the package for you!  

## Examples

### All Badges

[![Lighthouse Accessibility Badge](./assets/img/scores/lighthouse_accessibility.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Best Practices Badge](./assets/img/scores/lighthouse_best-practices.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Performance Badge](./assets/img/scores/lighthouse_performance.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse PWA Badge](./assets/img/scores/lighthouse_pwa.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse SEO Badge](./assets/img/scores/lighthouse_seo.svg)](https://github.com/emazzotta/lighthouse-badges)

### Single Badge

[![Lighthouse](./assets/img/scores/lighthouse.svg)](https://github.com/emazzotta/lighthouse-badges)

## Usage

### Help

```txt
usage: lighthouse-badges [-h] [-v] [-s]
                         [-b {flat,flat-square,plastic,for-the-badge,popout,popout-square,social}]
                         [-o OUTPUT_PATH] [-r] -u URLS [URLS ...]


Generate gh-badges (shields.io) based on lighthouse performance.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -s, --single-badge    Output only one single badge averaging all lighthouse
                        categories' scores
  -b {flat,flat-square,plastic,for-the-badge,popout,popout-square,social}, --badge-style {flat,flat-square,plastic,for-the-badge,popout,popout-square,social}
                        Define look and feel for the badge
  -o OUTPUT_PATH, --output-path OUTPUT_PATH
                        Define output path for artifacts
  -r, --save-report     Save lighthouse report as html for every supplied url

Required arguments:
  -u URLS [URLS ...], --urls URLS [URLS ...]
                        The lighthouse badge(s) will contain the respective
                        average score(s) of all the urls supplied, combined
```

Additionally you can pass parameters to the lighthouse process directly via environment variable:

```bash
# This will pass '--emulated-form-factor=desktop' to the lighthouse process
export LIGHTHOUSE_BADGES_PARAMS="--emulated-form-factor=desktop"
lighthouse-badges --urls https://www.youtube.com/
```

### Run

Hint: node versions below 12 are not supported.

#### Option 1: npm
```bash
npm i -g lighthouse-badges
lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending -o test_results
```

#### Option 2: npx
```bash
npx lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending -o test_results
```

#### Option 3: Docker
```bash
# Warning, the docker version may alter the lighthouse results
docker run --rm \
    -v $PWD/test_results:/home/chrome/reports \
    emazzotta/lighthouse-badges \
    /bin/sh -c "lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending"
```

## Contributing

See [contribution guideline](./CONTRIBUTING.md)

## Sponsors

Sponsored by JetBrains

<a href="https://www.jetbrains.com/?from=Lighthouse-Badges">
  <img alt="Jetbrains Logo" src="./assets/img/jetbrains.svg" width="100%" height="100">
</a>

## Author

[Emanuele Mazzotta](mailto:hello@mazzotta.me)
