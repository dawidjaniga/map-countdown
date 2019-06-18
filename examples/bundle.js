
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

  var Map =
  /*#__PURE__*/
  function () {
    function Map() {// this.loadMaps()

      _classCallCheck(this, Map);
    }

    _createClass(Map, [{
      key: "updatePolygon",
      value: function updatePolygon(name, value) {} // console.log('name:', name)
      //   async loadMaps () {
      //     console.log('loadMaps:')
      //     try {
      //       const googleMaps = await loadGoogleMapsApi({
      //         key: 'AIzaSyCYkWHZM0ZdO1JeJGBqo44wLlQz31lh-zM',
      //         libraries: ['drawing']
      //       })
      //       this.map = new googleMaps.Map(document.querySelector('#map'), {
      //         center: {
      //           lat: 40.7484405,
      //           lng: -73.9944191
      //         },
      //         zoom: 12
      //       })
      //     } catch (e) {
      //       console.error('Maps errors', e)
      //     }
      //   }

    }]);

    return Map;
  }();

  var MapCountdown =
  /*#__PURE__*/
  function () {
    function MapCountdown(containerSelector) {
      _classCallCheck(this, MapCountdown);

      this.countdown = new Countdown(containerSelector);
      this.map = new Map();
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
