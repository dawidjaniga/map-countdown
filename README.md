# MapCountdown

[![Build Status](https://travis-ci.org/dawidjaniga/map-countdown.svg?branch=master)](https://travis-ci.org/dawidjaniga/map-countdown)
[![Coverage Status](https://img.shields.io/codecov/c/github/dawidjaniga/map-countdown.svg)](asd)
![Build Status](https://img.shields.io/david/dawidjaniga/map-countdown.svg)


## Overview
MapCountdown is a JavaScript browser library which shows countdown with additional route filling on a map. It uses Google Map to draw polygons from provided paths and animates them according to time left.

## Demo
![Demo](./assets/map-countdown-demo.gif)


## Usage

### With module bundler - Webpack, Rollup, Parcel etc.
1. Install
```
yarn install map-countdown
```
or
```
npm install map-countdown
```
2. Import MapCountdown
```
import MapCountdown from 'map-countdown'
import routePoints from './../path/to/routePoints'
new Countdown({
    var countdown = new MapCountdown({
        selector: '#countdown',
        key: 'GOOGLE_API_KEY',
        routePoints: routePoints,
        meta: '2019-07-13 11:30:00',
    })
})
```

### Browser
```
<script type="text/javascript" src="unpkg.com/map-countdown">
<script src="routePoints.js"></script>
<script>
    window.addEventListener('DOMContentLoaded', function () {
        var countdown = new MapCountdown({
            selector: '#countdown',
            key: 'GOOGLE_API_KEY',
            routePoints: routePoints,
            meta: '2019-07-13 11:30:00',
        })
    })
</script>

```