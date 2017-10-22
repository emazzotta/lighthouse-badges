[![Build Status](https://travis-ci.org/emazzotta/lighthouse-badges.svg?branch=master)](https://travis-ci.org/emazzotta/lighthouse-badges)
[![Dev Dependencies](https://david-dm.org/emazzotta/lighthouse-badges.svg?style=flat)](https://david-dm.org/emazzotta/lighthouse-badges)
[![Downloads Today](https://img.shields.io/npm/dt/lighthouse-badges.svg?style=flat)](https://badge.fury.io/js/lighthouse-badges)
[![NPM version](https://img.shields.io/npm/v/lighthouse-badges.svg)](https://www.npmjs.org/package/lighthouse-badges)
[![Docker Commit](https://images.microbadger.com/badges/commit/emazzotta/lighthouse-badges.svg)](https://microbadger.com/images/emazzotta/lighthouse-badges)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://emanuelemazzotta.com/mit-license) 

# Lighthouse Badges

[![Lighthouse](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/lighthouse.svg)](https://github.com/GoogleChrome/lighthouse)

This package allows you to easily create Lighthouse badges for all four Lighthouse categories.  
Ever wanted to brag about your sites's awesome Lighthouse performance? Then this is the package for you!  

## Example Badges

### Four Badges

[![Lighthouse Accessibility Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_accessibility.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Best Practices Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_best_practices.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Progressive Web App Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_progressive_web_app.svg)](https://github.com/emazzotta/lighthouse-badges)
[![Lighthouse Performance Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse_performance.svg)](https://github.com/emazzotta/lighthouse-badges)

### Single Badge

[![Lighthouse](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/scores/lighthouse.svg)](https://github.com/emazzotta/lighthouse-badges)  

## Usage

You have the option to choose between Docker or npm. 

### Help

```bash
usage: lighthouse-badges [-h] [-v] [-s] [-b {flat,flat-square,plastic}] -u
                         URLS [URLS ...]


A simple npm package to generate gh-badges (shields.io) based on lighthouse
performance.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -s, --single-badge    Only output one single badge averaging the four
                        lighthouse scores
  -b {flat,flat-square,plastic}, --badge-style {flat,flat-square,plastic}
                        Badge style for the svg

Required arguments:
  -u URLS [URLS ...], --urls URLS [URLS ...]
                        The lighthouse badge(s) will contain the respective
                        average score(s) of all the urls supplied, combined

```

### Docker

```bash
docker pull emazzotta/lighthouse-badges
# Replace $(pwd) with the badges save path on your host 
docker run \
    -v $(pwd):/badges \
    --cap-add=SYS_ADMIN \
    emazzotta/lighthouse-badges \
    /bin/bash -c "lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending"
```

### npm 
    
#### Installation

```bash
npm i -g lighthouse-badges
```

#### Usage

```bash
# The badges will be saved in your current directory
lighthouse-badges --urls https://www.youtube.com/ https://www.youtube.com/feed/trending
```

## TODO

* [ ] Switch to Jest
* [ ] Add system test in travis
* [ ] Implement saving artifact

## Author(s)

Emanuele Mazzotta
