
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var MapCountdown = (function () {
  'use strict';

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

  var Countdown =
  /*#__PURE__*/
  function () {
    function Countdown(containerSelector) {
      var _this = this;

      _classCallCheck(this, Countdown);

      this.meta = new Date(2019, 6, 13, 11);
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
      this.containerEl = document.querySelector(containerSelector);
      var fragment = document.createDocumentFragment();
      Object.values(this.elements).forEach(function (item) {
        var element = _this.createElement('div', item.testId);

        item.element = element;
        fragment.appendChild(element);
      });
      this.containerEl.appendChild(fragment);
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
        console.log('events:', this.events);
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
        this.elements[name].element.innerHTML = value;
      }
    }, {
      key: "recountTime",
      value: function recountTime() {
        var now = new Date();
        var diff = new Date(this.meta - now);
        var daysNumberDiff = new Date(now - this.beginOfYear);
        var currentDayNumberInYear = Math.floor(daysNumberDiff / this.oneDayMilliseconds);
        var days = this.metaDayNumberInYear - currentDayNumberInYear;
        var hours = diff.getHours();
        var minutes = diff.getMinutes();
        var seconds = diff.getSeconds();
        var daysRatio = currentDayNumberInYear / this.metaDayNumberInYear;
        var hoursRatio = diff.getHours() / 24;
        var minutesRatio = diff.getMinutes() / 60;
        var secondsRatio = diff.getSeconds() / 60;
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
    }]);

    return Countdown;
  }(); // google.maps.event.addDomListener(window, 'load', function () {

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
          selector = _ref.selector,
          options = _ref.options;

      _classCallCheck(this, Map);

      this.key = key;
      this.callback = '__MapCountdownLoadMap';
      this.libraries = ['drawing'];

      window[this.callback] = function () {
        _this.loadMap(selector, options);
      };

      this.appendMapScriptToDocument();
    }

    _createClass(Map, [{
      key: "updatePolygon",
      value: function updatePolygon(name, value) {// console.log('name:', name)
      }
    }, {
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
      key: "loadMap",
      value: function loadMap(mapContainerSelector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var defaultOptions = {
          zoom: 14,
          center: {
            lat: 53.79061631330304,
            lng: 17.242156863212585
          },
          backgroundColor: COLORS.MAP_BACKGROUND,
          mapTypeId: 'terrain',
          scrollwheel: false,
          styles: mapStyle
        };
        this.map = new google.maps.Map(document.querySelector(mapContainerSelector), _objectSpread({}, defaultOptions, options));
      }
    }]);

    return Map;
  }();

  var MapCountdown =
  /*#__PURE__*/
  function () {
    function MapCountdown(containerSelector) {
      _classCallCheck(this, MapCountdown);

      this.countdown = new Countdown(containerSelector);
      this.map = new Map({
        key: 'AIzaSyCYkWHZM0ZdO1JeJGBqo44wLlQz31lh-zM',
        selector: '#map'
      });
      this.countdown.addEventListener('countdown:recount', this.updateMap.bind(this));
    }

    _createClass(MapCountdown, [{
      key: "updateMap",
      value: function updateMap(ratios) {
        var _this = this;

        Object.keys(ratios).forEach(function (name) {
          _this.map.updatePolygon(name, ratios[name]);
        });
      }
    }]);

    return MapCountdown;
  }();

  return MapCountdown;

}());
