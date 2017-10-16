[![Downloads Today](https://img.shields.io/npm/dt/lighthouse-badges.svg?style=flat)](https://badge.fury.io/js/lighthouse-badges)
[![Dev Dependencies](https://david-dm.org/emazzotta/lighthouse-badges.svg?style=flat)](https://david-dm.org/emazzotta/lighthouse-badges)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](https://emanuelemazzotta.com/mit-license) 
[![Docker Commit](https://images.microbadger.com/badges/commit/emazzotta/lighthouse-badges.svg)](https://microbadger.com/images/emazzotta/lighthouse-badges)

# Lighthouse Badges

[![Lighthouse](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/img/lighthouse.svg)](https://github.com/GoogleChrome/lighthouse)

This package allows you to easily create Lighthouse badges for all four Lighthouse categories.

## Usage via Docker

```bash
# Replace $(pwd) with the badges save path on your host 
docker run \
    -v $(pwd):/badges \
    --cap-add=SYS_ADMIN \
    emazzotta/lighthouse-badges /bin/bash -c "lighthouse-badges https://www.youtube.com/ https://www.youtube.com/feed/trending"
```

## Installation

```bash
npm i -g lighthouse-badges
```

## Usage

```bash
# Add as many sites as you like
# The four Lighthouse badges will be the average scores of all the pages combined
# The badges will be saved in your current directory
lighthouse-badges https://www.youtube.com/ https://www.youtube.com/feed/trending
```

## Example Badges

[![Lighthouse Accessibility Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/examples/Lighthouse_Accessibility.svg)](https://github.com/emazzotta/lighthouse-badges)  
[![Lighthouse Best Practices Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/examples/Lighthouse_Best_Practices.svg)](https://github.com/emazzotta/lighthouse-badges)  
[![Lighthouse Progressive Web App Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/examples/Lighthouse_Progressive_Web_App.svg)](https://github.com/emazzotta/lighthouse-badges)  
[![Lighthouse Performance Badge](https://rawgit.com/emazzotta/lighthouse-badges/master/assets/examples/Lighthouse_Performance.svg)](https://github.com/emazzotta/lighthouse-badges)  

## TODO

* [ ] Proper tests (adapt script command too)

## Author(s)

Emanuele Mazzotta
