var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WINDOW_ROUTE_POINTS_KEY = '__MapCountdownRoutePoints';
});
define("countdown", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultTranslations = {
        daysOne: 'Day',
        daysMany: 'Days',
        hoursOne: 'Hour',
        hoursMany: 'Hours',
        minutesOne: 'Minute',
        minutesMany: 'Minutes',
        secondsOne: 'Second',
        secondsMany: 'Seconds',
        afterCountdown: 'The event has already took place'
    };
    var Countdown = /** @class */ (function () {
        function Countdown(_a) {
            var containerElement = _a.containerElement, meta = _a.meta, translations = _a.translations;
            var _this = this;
            this.containerElement = containerElement;
            this.translations = __assign({}, defaultTranslations, translations);
            this.elements = {};
            this.countdownContainer = document.createElement('div');
            this.countdownContainer.classList.add('map-countdown__countdown');
            this.meta = new Date(meta);
            this.oneDayMilliseconds = 86400000;
            this.beginOfYear = new Date(this.meta.getFullYear(), 0, 0);
            this.metaDaysNumberDiff = this.meta.valueOf() - this.beginOfYear.valueOf();
            this.metaDayNumberInYear = Math.floor(this.metaDaysNumberDiff / this.oneDayMilliseconds);
            var fragment = document.createDocumentFragment();
            var elements = ['days', 'hours', 'minutes', 'seconds'];
            elements.forEach(function (itemName) {
                var elementFragment = document.createDocumentFragment();
                var item = _this.elements[itemName];
                var testId = "map-countdown-" + itemName;
                var element = _this.createElement('div', testId);
                var number = document.createElement('div');
                var label = document.createElement('h4');
                element.classList.add('map-countdown__item');
                label.classList.add('map-countdown__label');
                elementFragment.appendChild(element);
                element.appendChild(number);
                element.appendChild(label);
                number.classList.add('map-countdown__number', "map-countdown__number--" + itemName);
                fragment.appendChild(elementFragment);
                _this.elements[itemName] = {
                    element: element,
                    number: number,
                    label: label,
                    testId: testId
                };
            });
            this.countdownContainer.appendChild(fragment);
            this.containerElement.appendChild(this.countdownContainer);
            this.events = {};
            this.recountTime();
            this.counterHandler = window.setInterval(function () { return _this.recountTime(); }, 1000);
        }
        Countdown.prototype.addEventListener = function (name, callback) {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        };
        Countdown.prototype.dispatchEvent = function (name, data) {
            var eventListeners = this.events[name];
            if (eventListeners) {
                eventListeners.forEach(function (listener) { return listener(data); });
            }
        };
        Countdown.prototype.createElement = function (tag, testId) {
            var element = document.createElement(tag);
            element.setAttribute('data-testid', testId);
            return element;
        };
        Countdown.prototype.setElementValue = function (name, value) {
            var element = this.elements[name];
            var translationKey = value === 1 ? name + "One" : name + "Many";
            var label = this.translations[translationKey];
            element.number.textContent = String(value);
            element.label.textContent = label;
        };
        Countdown.prototype.recountTime = function () {
            var now = new Date();
            var timeLeft = this.meta.valueOf() - now.valueOf();
            var countdownFinished = timeLeft < 0;
            var timeLeftDate = new Date(timeLeft);
            var daysNumberDiff = new Date(now.valueOf() - this.beginOfYear.valueOf());
            var currentDayNumberInYear = Math.floor(daysNumberDiff.valueOf() / this.oneDayMilliseconds);
            if (countdownFinished) {
                this.finishCountdown();
            }
            else {
                var days = this.metaDayNumberInYear - currentDayNumberInYear;
                var hours = timeLeftDate.getHours();
                var minutes = timeLeftDate.getMinutes();
                var seconds = timeLeftDate.getSeconds();
                var daysRatio = currentDayNumberInYear / this.metaDayNumberInYear;
                var hoursRatio = timeLeftDate.getHours() / 24;
                var minutesRatio = timeLeftDate.getMinutes() / 60;
                var secondsRatio = timeLeftDate.getSeconds() / 60;
                var ratios = {
                    days: daysRatio,
                    hours: hoursRatio,
                    minutes: minutesRatio,
                    seconds: secondsRatio
                };
                this.dispatchEvent('countdown:recount', ratios);
                this.setElementValue('days', days);
                this.setElementValue('hours', hours);
                this.setElementValue('minutes', minutes);
                this.setElementValue('seconds', seconds);
            }
        };
        Countdown.prototype.finishCountdown = function () {
            var afterCountdown = this.createElement('h2', 'map-countdown-title');
            afterCountdown.classList.add('map-countdown__title');
            afterCountdown.textContent = this.translations.afterCountdown;
            clearInterval(this.counterHandler);
            this.countdownContainer.innerHTML = '';
            this.countdownContainer.appendChild(afterCountdown);
        };
        return Countdown;
    }());
    exports.default = Countdown;
});
define("map/styles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapStyle = [
        {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [
                {
                    saturation: 36
                },
                {
                    color: "#000000"
                },
                {
                    lightness: 40
                }
            ]
        },
        {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [
                {
                    visibility: "on"
                },
                {
                    color: "#000000"
                },
                {
                    lightness: 16
                }
            ]
        },
        {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [
                {
                    visibility: "off"
                }
            ]
        },
        {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 20
                }
            ]
        },
        {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 17
                },
                {
                    weight: 1.2
                }
            ]
        },
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 20
                }
            ]
        },
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 21
                }
            ]
        },
        {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 17
                }
            ]
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 29
                },
                {
                    weight: 0.2
                }
            ]
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 18
                }
            ]
        },
        {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 16
                }
            ]
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 19
                }
            ]
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000"
                },
                {
                    lightness: 17
                }
            ]
        }
    ];
});
define("map/map", ["require", "exports", "map/styles"], function (require, exports, styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COLORS = {
        MAP_BACKGROUND: '#333333',
        DAYS: '#252d11',
        HOURS: '#643627',
        MINUTES: '#822d76',
        SECONDS: '#afd02a',
    };
    var Map = /** @class */ (function () {
        function Map(_a) {
            var key = _a.key, containerElement = _a.containerElement, options = _a.options;
            var _this = this;
            this.key = key;
            this.callback = '__MapCountdownLoadMap';
            this.libraries = ['drawing'];
            this.routePoints = [];
            this.maxDistance = 0;
            this.mapContainer = document.createElement('div');
            this.mapContainer.classList.add('map-countdown__map');
            containerElement.appendChild(this.mapContainer);
            window[this.callback] = function () {
                delete window[_this.callback];
                _this.loadMap(_this.mapContainer, options);
                _this.initPolygons();
            };
            if (!window.google || !window.google.hasOwnProperty('maps')) {
                this.appendMapScriptToDocument();
            }
        }
        Map.prototype.appendMapScriptToDocument = function () {
            document.body.appendChild(this.createMapScript());
        };
        Map.prototype.createMapScript = function () {
            var script = document.createElement('script');
            script.setAttribute('src', "https://maps.googleapis.com/maps/api/js?key=" + this.key + "&callback=" + this.callback + "&libraries=" + this.libraries);
            script.setAttribute('defer', "true");
            script.setAttribute('async', "true");
            return script;
        };
        Map.prototype.getMapContainer = function () {
            return this.mapContainer;
        };
        Map.prototype.loadMap = function (mapContainer, options) {
            if (options === void 0) { options = {}; }
            var mapTypeStyle = styles_1.mapStyle;
            var defaultOptions = {
                zoom: 14,
                center: {
                    lat: 53.79564218580562,
                    lng: 17.285329699516296
                },
                backgroundColor: COLORS.MAP_BACKGROUND,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                styles: mapTypeStyle,
                disableDefaultUI: true
            };
            this.map = new google.maps.Map(mapContainer, __assign({}, defaultOptions, options));
        };
        Map.prototype.initPolygons = function () {
            this.daysPolyline = new google.maps.Polyline({
                map: this.map,
                strokeColor: COLORS.DAYS,
                strokeWeight: 10
            });
            this.hoursPolyline = new google.maps.Polyline({
                map: this.map,
                strokeColor: COLORS.HOURS,
                strokeWeight: 5
            });
            this.minutesPolyline = new google.maps.Polyline({
                map: this.map,
                strokeColor: COLORS.MINUTES,
                strokeWeight: 5
            });
            this.secondsPolyline = new google.maps.Polyline({
                map: this.map,
                strokeColor: COLORS.SECONDS,
                strokeWeight: 1
            });
        };
        Map.prototype.setRoutePoints = function (points) {
            this.routePoints = points;
            this.maxDistance = Math.max.apply(Math, points.map(function (point) { return parseFloat(point.DistanceMeters); }));
        };
        Map.prototype.getRoutePoints = function () {
            return this.routePoints;
        };
        Map.prototype.updatePolygons = function (ratios) {
            var _this = this;
            var days = ratios.days, hours = ratios.hours, minutes = ratios.minutes, seconds = ratios.seconds;
            var daysPath = [];
            var hoursPath = [];
            var minutesPath = [];
            var secondsPath = [];
            this.routePoints.forEach(function (point) {
                var position = new google.maps.LatLng({
                    lat: parseFloat(point.Position.LatitudeDegrees),
                    lng: parseFloat(point.Position.LongitudeDegrees)
                });
                var distance = parseFloat(point.DistanceMeters);
                var secondsMeters = (1 - seconds) * _this.maxDistance;
                var minutesMeters = (1 - minutes) * _this.maxDistance;
                var hoursMeters = (1 - hours) * _this.maxDistance;
                var daysMeters = (1 - days) * _this.maxDistance;
                if (distance < secondsMeters) {
                    secondsPath.push(position);
                }
                if (distance < minutesMeters) {
                    minutesPath.push(position);
                }
                if (distance < hoursMeters) {
                    hoursPath.push(position);
                }
                if (distance < daysMeters) {
                    daysPath.push(position);
                }
            });
            if (this.secondsPolyline) {
                this.secondsPolyline.setPath(secondsPath);
            }
            if (this.minutesPolyline) {
                this.minutesPolyline.setPath(minutesPath);
            }
            if (this.hoursPolyline) {
                this.hoursPolyline.setPath(hoursPath);
            }
            if (this.daysPolyline) {
                this.daysPolyline.setPath(daysPath);
            }
        };
        return Map;
    }());
    exports.default = Map;
});
define("texts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROUTE_OPTIONS_MISSING_ERROR = "MapCountdown: route points are missing.\nDid you include routePoints.js in head section?\nCheck for more information: https://github.com/dawidjaniga/map-countdown#add-mapcountdown";
    exports.CONTAINER_SELECTOR_ERROR = "MapCountdown: no element found for passed selector\nCheck element with specified selector exists or MapCountdown is initialized after DOMContentLoaded event.";
});
define("map-countdown", ["require", "exports", "countdown", "map/map", "constants", "texts", "./style.css"], function (require, exports, countdown_1, map_1, constants_1, texts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    countdown_1 = __importDefault(countdown_1);
    map_1 = __importDefault(map_1);
    var MapCountdown = /** @class */ (function () {
        function MapCountdown(_a) {
            var selector = _a.selector, key = _a.key, meta = _a.meta, translations = _a.translations;
            this.containerElement = document.querySelector(selector);
            if (!window[constants_1.WINDOW_ROUTE_POINTS_KEY]) {
                console.error(texts_1.ROUTE_OPTIONS_MISSING_ERROR);
                return;
            }
            if (!this.containerElement) {
                console.error(texts_1.CONTAINER_SELECTOR_ERROR);
                return;
            }
            this.containerElement.classList.add('map-countdown');
            this.countdown = new countdown_1.default({
                containerElement: this.containerElement,
                meta: meta,
                translations: translations
            });
            this.map = new map_1.default({
                key: key,
                containerElement: this.containerElement
            });
            this.map.setRoutePoints(window[constants_1.WINDOW_ROUTE_POINTS_KEY]);
            this.attachEvents();
            delete window[constants_1.WINDOW_ROUTE_POINTS_KEY];
        }
        MapCountdown.prototype.attachEvents = function () {
            this.countdown.addEventListener('countdown:recount', this.updateMap.bind(this));
        };
        MapCountdown.prototype.updateMap = function (ratios) {
            this.map.updatePolygons(ratios);
        };
        return MapCountdown;
    }());
    exports.default = MapCountdown;
});
