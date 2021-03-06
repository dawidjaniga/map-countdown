(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MapCountdown = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var defaultTranslations = {
    days: {
      one: 'Day',
      many: 'Days'
    },
    hours: {
      one: 'Hour',
      many: 'Hours'
    },
    minutes: {
      one: 'Minute',
      many: 'Minutes'
    },
    seconds: {
      one: 'Second',
      many: 'Seconds'
    },
    afterCountdown: 'The event has already took place'
  };

  var Countdown =
  /*#__PURE__*/
  function () {
    function Countdown(_ref) {
      var _this = this;

      var containerElement = _ref.containerElement,
          meta = _ref.meta,
          translations = _ref.translations;

      _classCallCheck(this, Countdown);

      this.containerElement = containerElement;
      this.translations = _objectSpread({}, defaultTranslations, translations);
      this.countdownContainer = document.createElement('div');
      this.countdownContainer.classList.add('map-countdown__countdown');
      this.meta = new Date(meta);
      this.oneDayMilliseconds = 86400000;
      this.beginOfYear = new Date(this.meta.getFullYear(), 0, 0);
      this.metaDaysNumberDiff = this.meta - this.beginOfYear;
      this.metaDayNumberInYear = Math.floor(this.metaDaysNumberDiff / this.oneDayMilliseconds);
      this.elements = {
        days: {
          testId: 'map-countdown-days'
        },
        hours: {
          testId: 'map-countdown-hours'
        },
        minutes: {
          testId: 'map-countdown-minutes'
        },
        seconds: {
          testId: 'map-countdown-seconds'
        }
      };
      var fragment = document.createDocumentFragment();
      Object.keys(this.elements).forEach(function (itemName) {
        var elementFragment = document.createDocumentFragment();
        var item = _this.elements[itemName];

        var element = _this.createElement('div', item.testId);

        var number = document.createElement('div');
        var label = document.createElement('h4');
        element.classList.add('map-countdown__item');
        label.classList.add('map-countdown__label');
        elementFragment.appendChild(element);
        element.appendChild(number);
        element.appendChild(label);
        number.classList.add('map-countdown__number', "map-countdown__number--".concat(itemName));
        fragment.appendChild(elementFragment);
        item.element = element;
        item.number = number;
        item.label = label;
      });
      this.countdownContainer.appendChild(fragment);
      this.containerElement.appendChild(this.countdownContainer);
      this.events = {};
      this.recountTime();
      this.counterHandler = setInterval(function () {
        return _this.recountTime();
      }, 1000);
    }

    _createClass(Countdown, [{
      key: "addEventListener",
      value: function addEventListener(name, callback) {
        if (!this.events[name]) {
          this.events[name] = [];
        }

        this.events[name].push(callback);
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(name, args) {
        var eventListeners = this.events[name];

        if (eventListeners) {
          eventListeners.forEach(function (listener) {
            return listener(args);
          });
        }
      }
    }, {
      key: "createElement",
      value: function createElement(tag, testId) {
        var element = document.createElement(tag);
        element.setAttribute('data-testid', testId);
        return element;
      }
    }, {
      key: "setElementValue",
      value: function setElementValue(name, value) {
        var element = this.elements[name];
        var translations = this.translations[name];
        var label = value === 1 ? translations.one : translations.many;
        element.number.textContent = value;
        element.label.textContent = label;
      }
    }, {
      key: "recountTime",
      value: function recountTime() {
        var now = new Date();
        var timeLeft = this.meta - now;
        var countdownFinished = timeLeft < 0;
        var timeLeftDate = new Date(timeLeft);
        var daysNumberDiff = new Date(now - this.beginOfYear);
        var currentDayNumberInYear = Math.floor(daysNumberDiff / this.oneDayMilliseconds);

        if (countdownFinished) {
          this.finishCountdown();
        } else {
          var days = this.metaDayNumberInYear - currentDayNumberInYear;
          var hours = timeLeftDate.getHours();
          var minutes = timeLeftDate.getMinutes();
          var seconds = timeLeftDate.getSeconds();
          var daysRatio = currentDayNumberInYear / this.metaDayNumberInYear;
          var hoursRatio = timeLeftDate.getHours() / 24;
          var minutesRatio = timeLeftDate.getMinutes() / 60;
          var secondsRatio = timeLeftDate.getSeconds() / 60;
          this.dispatchEvent('countdown:recount', {
            days: daysRatio,
            hours: hoursRatio,
            minutes: minutesRatio,
            seconds: secondsRatio
          });
          this.setElementValue('days', days);
          this.setElementValue('hours', hours);
          this.setElementValue('minutes', minutes);
          this.setElementValue('seconds', seconds);
        }
      }
    }, {
      key: "finishCountdown",
      value: function finishCountdown() {
        var afterCountdown = this.createElement('h2', 'map-countdown-title');
        afterCountdown.classList.add('map-countdown__title');
        afterCountdown.textContent = this.translations.afterCountdown;
        clearInterval(this.counterHandler);
        this.countdownContainer.innerHTML = '';
        this.countdownContainer.appendChild(afterCountdown);
      }
    }]);

    return Countdown;
  }();

  var mapStyle = [{
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{
      saturation: 36
    }, {
      color: '#000000'
    }, {
      lightness: 40
    }]
  }, {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{
      visibility: 'on'
    }, {
      color: '#000000'
    }, {
      lightness: 16
    }]
  }, {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 20
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 17
    }, {
      weight: 1.2
    }]
  }, {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 20
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 21
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 17
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 29
    }, {
      weight: 0.2
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 18
    }]
  }, {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 16
    }]
  }, {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 19
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }, {
      lightness: 17
    }]
  }];

  var COLORS = {
    RUNDA_MAIN: '#afd02a',
    FORESTGREEN: '#228B22',
    MAP_BACKGROUND: '#333333',
    DAYS: '#252d11',
    HOURS: '#643627',
    MINUTES: '#822d76',
    SECONDS: '#afd02a',
    ROUTE_1: '#ED7296',
    ROUTE_2: '#7072CF',
    ROUTE_3: '#FFF1CE',
    ROUTE_4: '#FF9311',
    ROUTE_5: '#D64700',
    ROUTE_6: '#2980B9'
  };

  var Map =
  /*#__PURE__*/
  function () {
    function Map(_ref) {
      var _this = this;

      var key = _ref.key,
          containerElement = _ref.containerElement,
          options = _ref.options;

      _classCallCheck(this, Map);

      this.key = key;
      this.callback = '__MapCountdownLoadMap';
      this.libraries = ['drawing'];
      this.routePoints = [];
      this.maxDistance = 0;
      this.secondsPolyline = {};
      this.minutesPolyline = {};
      this.hoursPolyline = {};
      this.daysPolyline = {};
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

    _createClass(Map, [{
      key: "appendMapScriptToDocument",
      value: function appendMapScriptToDocument() {
        document.body.appendChild(this.createMapScript());
      }
    }, {
      key: "createMapScript",
      value: function createMapScript() {
        var script = document.createElement('script');
        script.setAttribute('src', "https://maps.googleapis.com/maps/api/js?key=".concat(this.key, "&callback=").concat(this.callback, "&libraries=").concat(this.libraries));
        script.setAttribute('defer', true);
        script.setAttribute('async', true);
        return script;
      }
    }, {
      key: "getMapContainer",
      value: function getMapContainer() {
        return this.mapContainer;
      }
    }, {
      key: "loadMap",
      value: function loadMap(mapContainer) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var defaultOptions = {
          zoom: 14,
          center: {
            lat: 53.79564218580562,
            lng: 17.285329699516296
          },
          backgroundColor: COLORS.MAP_BACKGROUND,
          mapTypeId: 'roadmap',
          scrollwheel: false,
          styles: mapStyle,
          disableDefaultUI: true
        };
        this.map = new google.maps.Map(mapContainer, _objectSpread({}, defaultOptions, options));
        window.map = this.map;
      }
    }, {
      key: "initPolygons",
      value: function initPolygons() {
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
      }
    }, {
      key: "setRoutePoints",
      value: function setRoutePoints(points) {
        this.routePoints = points;
        this.maxDistance = Math.max.apply(Math, _toConsumableArray(points.map(function (point) {
          return point.DistanceMeters;
        })));
      }
    }, {
      key: "getRoutePoints",
      value: function getRoutePoints(points) {
        return this.routePoints;
      }
    }, {
      key: "updatePolygons",
      value: function updatePolygons(days, hours, minutes, seconds) {
        var maxDistance = 10003;
        var daysPath = [];
        var hoursPath = [];
        var minutesPath = [];
        var secondsPath = [];
        this.routePoints.forEach(function (point) {
          var position = new google.maps.LatLng({
            lat: parseFloat(point.Position.LatitudeDegrees),
            lng: parseFloat(point.Position.LongitudeDegrees)
          });
          var distance = point.DistanceMeters;
          var secondsMeters = parseFloat((1 - seconds) * maxDistance);
          var minutesMeters = parseFloat((1 - minutes) * maxDistance);
          var hoursMeters = parseFloat((1 - hours) * maxDistance);
          var daysMeters = parseFloat((1 - days) * maxDistance);

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
        this.secondsPolyline.setPath(secondsPath);
        this.minutesPolyline.setPath(minutesPath);
        this.hoursPolyline.setPath(hoursPath);
        this.daysPolyline.setPath(daysPath);
      }
    }]);

    return Map;
  }();

  var WINDOW_ROUTE_POINTS_KEY = '__MapCountdownRoutePoints';

  var ROUTE_OPTIONS_MISSING_ERROR = "MapCountdown: route points are missing.\nDid you include routePoints.js in head section?\nCheck for more information: https://github.com/dawidjaniga/map-countdown#add-mapcountdown";

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".map-countdown {\n\tposition: relative;\n    pointer-events: none;\n}\n\n.map-countdown__countdown {\n    position: absolute;\n    display: flex;\n    align-items: center;\n    justify-content: space-around;\n    z-index: 100;\n    width: 100%;\n    height: 100%;\n}\n\n.map-countdown__item {\n\twidth: 12%;\n}\n.map-countdown__number {\n\tcolor: #FFF;\n\tfont-size: 50pt;\n\tfont-family: 'Raleway', sans-serif;\n\tborder-bottom: 2px solid;\n\tfont-weight: 500;\n}\n.map-countdown__number--days {\n\tborder-color: #202808;\n}\n.map-countdown__number--hours {\n\tborder-color: #643627;\n}\n.map-countdown__number--minutes {\n\tborder-color: #822d76;\n}\n.map-countdown__number--seconds {\n\tborder-color: #afd02a;\n}\n.map-countdown__label {\n\tcolor: #FFF;\n    text-transform: uppercase;\n    font-weight: 100;\n    margin-top: 10%;\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\n}\n\n.map-countdown__title {\n\tcolor: #FFF;\n    text-transform: uppercase;\n    font-weight: 100;\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\n}\n\n.map-countdown__map {\n    width: 100%;\n    height: 100%;\n    min-height: 50vh;\n}\n\n@media (max-width: 600px) {\n    .map-countdown {\n        height: 100vh;\n    }\n    \n    .map-countdown__countdown {\n        flex-direction: column;\n    }\n    \n    .map-countdown__item {\n        width: 100%;\n        display: flex;\n        flex-direction: row;\n        justify-content: space-around;\n        align-items: center;\n    }\n    \n}";
  styleInject(css);

  var MapCountdown =
  /*#__PURE__*/
  function () {
    function MapCountdown(_ref) {
      var selector = _ref.selector,
          key = _ref.key,
          meta = _ref.meta,
          translations = _ref.translations;

      _classCallCheck(this, MapCountdown);

      if (!window[WINDOW_ROUTE_POINTS_KEY]) {
        console.error(ROUTE_OPTIONS_MISSING_ERROR);
        return;
      }

      this.containerElement = document.querySelector(selector);
      this.containerElement.classList.add('map-countdown');
      this.countdown = new Countdown({
        containerElement: this.containerElement,
        meta: meta,
        translations: translations
      });
      this.map = new Map({
        key: key,
        containerElement: this.containerElement
      });
      this.map.setRoutePoints(window[WINDOW_ROUTE_POINTS_KEY]);
      this.attachEvents();
      delete window[WINDOW_ROUTE_POINTS_KEY];
    }

    _createClass(MapCountdown, [{
      key: "attachEvents",
      value: function attachEvents() {
        this.countdown.addEventListener('countdown:recount', this.updateMap.bind(this));
      }
    }, {
      key: "updateMap",
      value: function updateMap(ratios) {
        var _this$map;

        (_this$map = this.map).updatePolygons.apply(_this$map, _toConsumableArray(Object.values(ratios)));
      }
    }]);

    return MapCountdown;
  }();

  return MapCountdown;

}));
