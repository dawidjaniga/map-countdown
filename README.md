# MapCountdown

[![Build Status](https://travis-ci.org/dawidjaniga/map-countdown.svg?branch=master)](https://travis-ci.org/dawidjaniga/map-countdown)
[![Coverage Status](https://img.shields.io/codecov/c/github/dawidjaniga/map-countdown.svg)](asd) [![Greenkeeper badge](https://badges.greenkeeper.io/dawidjaniga/map-countdown.svg)](https://greenkeeper.io/)
![Build Status](https://img.shields.io/david/dawidjaniga/map-countdown.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Overview
MapCountdown is a JavaScript browser library which shows countdown with additional route filling on a map. It uses Google Map to draw polygons from provided paths and animates them according to time left.

## Demo
![Demo](./assets/map-countdown-demo.gif)


## Usage

### With module bundler - Webpack, Rollup, Parcel etc.
1. Install MapCountdown
``` bash
yarn install map-countdown
```
or
``` bash
npm install map-countdown
```
2. Import MapCountdown
``` javascript
import MapCountdown from 'map-countdown'
import routePoints from './../path/to/routePoints'

new Countdown({
    selector: '#countdown',
    key: 'GOOGLE_API_KEY',
    meta: '2019-07-13 11:30:00',
    routePoints,
})
```

### Browser
``` html
<html lang="en">
<head>
    <title>MapCountdown Example</title>
    <script src="https://unpkg.com/map-countdown@latest/dist/bundle.js"></script>
    <script src="routePoints.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function () {
            new MapCountdown({
                selector: '#countdown',
                key: 'GOOGLE_API_KEY',
                routePoints: routePoints,
                meta: '2019-07-13 11:30:00',
            })
        })
    </script>
    <body>

        <div id="countdown"></div>

    </body>
</html>
```

### Prepare route points
To draw polygons on Google Maps we need to pass an array of route points. To do that we can import **.tcx** file and use `route-parser` CLI to parse it.

1. First ensure `map-countdown` is installed. Next you have to download workout in **.tcx** format. The most popular sport tracking app are supported:
    1. Endomondo - [Instructions](https://support.endomondo.com/hc/en-us/articles/213219528-File-Export)
    2. Polar - [Instructions](https://support.polar.com/en/support/how_do_i_export_individual_training_sessions_from_polar_flow_web_service)
    3. Garmin - [Instructions](https://support.garmin.com/pl-PL/?faq=W1TvTPW8JZ6LfJSfK512Q8)
2. After download open a terminal in your project's directory and run:
```bash
route-importer ~/Downloads/training-file.tcx routePoints.js
```
`route-importer` will parse _TCX_ file and save it with given name.