[![Build Status](https://travis-ci.org/emazzotta/lighthouse-badges.svg?branch=master)](https://travis-ci.org/emazzotta/lighthouse-badges)
[![Code Coverage](https://codecov.io/gh/emazzotta/lighthouse-badges/branch/master/graph/badge.svg)](https://travis-ci.org/emazzotta/lighthouse-badges)
[![Dependencies](https://david-dm.org/emazzotta/lighthouse-badges.svg?style=flat)](https://david-dm.org/emazzotta/lighthouse-badges)
[![Greenkeeper badge](https://badges.greenkeeper.io/emazzotta/lighthouse-badges.svg)](https://greenkeeper.io/)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://emanuelemazzotta.com/mit-license) 

# Lighthouse Badges

[![Lighthouse](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/lighthouse.svg)](https://github.com/GoogleChrome/lighthouse)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Femazzotta%2Flighthouse-badges.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Femazzotta%2Flighthouse-badges?ref=badge_shield)

This package allows you to easily create Lighthouse badges for all Lighthouse categories.  
Ever wanted to brag about your sites's awesome Lighthouse performance? Then this is the package for you!  

## Examples

### All Badges

[![Lighthouse Accessibility Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_accessibility.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Best Practices Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_best-practices.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Performance Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_performance.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse PWA Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_pwa.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse SEO Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_seo.svg)](https://github.com/emazzotta/lighthouse-badges)

### Single Badge

[![Lighthouse](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse.svg)](https://github.com/emazzotta/lighthouse-badges)

## Usage

### Help

```txt
usage: lighthouse-badges [-h] [-v] [-s] [-b {flat,flat-square,plastic}] [-r]
                         -u URLS [URLS ...]


Generate gh-badges (shields.io) based on lighthouse
performance.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -s, --single-badge    Output only one single badge averaging all
                        lighthouse categories' scores
  -b {flat,flat-square,plastic}, --badge-style {flat,flat-square,plastic}
                        Define look and feel for the badge
  -r, --save-report     Save lighthouse report as html for every supplied url

Required arguments:
  -u URLS [URLS ...], --urls URLS [URLS ...]
                        The lighthouse badge(s) will contain the respective
                        average score(s) of all the urls supplied, combined

```

### Run

```bash
# Using npm
npm i -g lighthouse-badges
# The badges will be saved in your current directory
lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending

# Using Docker
docker pull emazzotta/lighthouse-badges
# Replace $(pwd) with the report/svg save path on your host 
docker run -v $(pwd):/home/chrome/reports emazzotta/lighthouse-badges /bin/sh -c "lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending"
```

## Contributing

See [contribution guideline](./CONTRIBUTING.md)

## Author

[Emanuele Mazzotta](mailto:hello@mazzotta.me)



## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Femazzotta%2Flighthouse-badges.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Femazzotta%2Flighthouse-badges?ref=badge_large)