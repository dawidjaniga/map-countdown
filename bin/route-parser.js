#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var parser = _interopDefault(require('xml2json'));

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

var WINDOW_ROUTE_POINTS_KEY = '__MapCountdownRoutePoints';

var RouteParser =
/*#__PURE__*/
function () {
  function RouteParser(file, outputFilePath) {
    _classCallCheck(this, RouteParser);

    this.file = file;
    this.outputFilePath = outputFilePath;
  }

  _createClass(RouteParser, [{
    key: "parse",
    value: function parse() {
      var parsedFile = this.parseFileToJson(this.file);
      this.saveFile(this.outputFilePath, this.makeWindowAttachable(this.parsePoints(parsedFile)));
    }
  }, {
    key: "parseFileToJson",
    value: function parseFileToJson(file) {
      var xml = fs.readFileSync(file, 'utf8');
      return JSON.parse(parser.toJson(xml));
    }
  }, {
    key: "makeWindowAttachable",
    value: function makeWindowAttachable(data) {
      return "window.".concat(WINDOW_ROUTE_POINTS_KEY, " = ").concat(JSON.stringify(data));
    }
  }, {
    key: "saveFile",
    value: function saveFile(file, data) {
      var a = path.resolve(file);
      return fs.writeFileSync(a, data, 'utf8');
    }
  }, {
    key: "parsePoints",
    value: function parsePoints(parsedFile) {
      var _this = this;

      var points = parsedFile.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint;

      var hasDefinedDistance = function hasDefinedDistance(point) {
        return point.DistanceMeters;
      };

      return points.filter(hasDefinedDistance).map(function (point) {
        return _this.purifyTrackPoint(point);
      });
    }
  }, {
    key: "purifyTrackPoint",
    value: function purifyTrackPoint(point) {
      var position = point.Position || {};

      if (!point.Position) {
        throw new Error('Point has no position');
      }

      return {
        Position: {
          LatitudeDegrees: position.LatitudeDegrees,
          LongitudeDegrees: position.LongitudeDegrees
        },
        DistanceMeters: point.DistanceMeters,
        AltitudeMeters: point.AltitudeMeters || '0'
      };
    }
  }]);

  return RouteParser;
}();

var runFromCLI = require.main === module;
function main() {
  var file = process.argv[2];
  var outputFilePath = process.argv[3];
  var parser = new RouteParser(file, outputFilePath);

  try {
    parser.parse();
    console.log("\u2705 File ".concat(file, " successfully parsed and saved to ").concat(path.resolve(outputFilePath)));
  } catch (e) {
    throw e;
  }
}

if (runFromCLI) {
  main();
}

exports.main = main;
