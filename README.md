[![Build Status](https://github.com/emazzotta/lighthouse-badges/workflows/build/badge.svg)](https://github.com/emazzotta/lighthouse-badges/actions)
[![Code Coverage](https://codecov.io/gh/emazzotta/lighthouse-badges/branch/master/graph/badge.svg)](https://github.com/emazzotta/lighthouse-badges/actions)
[![NPM downloads](https://img.shields.io/npm/dt/lighthouse-badges?color=blue)](https://www.npmjs.org/package/lighthouse-badges)
[![NPM version](https://img.shields.io/npm/v/lighthouse-badges.svg)](https://www.npmjs.org/package/lighthouse-badges)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://emanuelemazzotta.com/mit-license)

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
usage: lighthouse-badges [-h] [-v] [-s] [-b {flat,flat-square,plastic,for-the-badge,social}] [-o OUTPUT_PATH] [-r] -u URL

Generate gh-badges (shields.io) based on lighthouse performance.

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  -s, --single-badge    Output only one single badge averaging all lighthouse categories' scores
  -b {flat,flat-square,plastic,for-the-badge,social}, --badge-style {flat,flat-square,plastic,for-the-badge,social}
                        Define look and feel for the badge
  -o OUTPUT_PATH, --output-path OUTPUT_PATH
                        Define output path for artifacts
  -r, --save-report     Save lighthouse report as html for every supplied url

Required arguments:
  -u URL, --url URL     The lighthouse badge(s) will contain the score(s) of all the supplied url
```

Additionally, you can pass parameters configurations to the lighthouse process directly via environment variable path to the config file:

```bash
# The variable name matters, but the path can be anything
export LIGHTHOUSE_BADGES_CONFIGURATION_PATH="~/.lhb-config.json" 

# "extends": "lighthouse:default" is needed, the rest is optional
cat << EOF >! $LIGHTHOUSE_BADGES_CONFIGURATION_PATH
{
  "extends": "lighthouse:default",
  "settings": {
    "extraHeaders": {
      "Authorization": "Bearer ..."
    },
    "onlyCategories": [
      "performance",
      "pwa"
    ],
    "formFactor": "mobile"
  }
}
EOF

lighthouse-badges --url https://www.youtube.com/
```

See [here](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md) for more configuration examples in the official lighthouse docs.

### Run

node >= 18 is required.

#### Option 1: npm
```bash
npm i -g lighthouse-badges
lighthouse-badges --url https://www.youtube.com/ -o test_results
```

#### Option 2: npx
```bash
npx lighthouse-badges --url https://www.youtube.com/ -o test_results
```

#### Option 3: Docker
```bash
# Warning, the docker version may alter the lighthouse results
docker run --rm \
    -v $PWD/test_results:/home/chrome/reports \
    emazzotta/lighthouse-badges \
    /bin/sh -c "lighthouse-badges --url https://www.youtube.com/"
```

### Develop

```bash
npm run start # To run the lighthouse-badges code on google.com
```

## Contributing

See [contribution guideline](./CONTRIBUTING.md)

## Sponsors

Sponsored by [JetBrains](https://www.jetbrains.com/?from=Lighthouse-Badges)

<a href="https://www.jetbrains.com/?from=Lighthouse-Badges">
  <img alt="Jetbrains Logo" src="./assets/img/jetbrains.svg" height="100">
</a>

## Author

[Emanuele Mazzotta](mailto:hello@mazzotta.me)
