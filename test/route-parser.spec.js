/* global describe, it, expect */
import path from 'path'
import RouteParser from '../src/route-parser'

describe('route-parser', () => {
  describe('parse()', () => {
    it('should process parsing route and return resulting array', () => {
      const file = path.resolve(__dirname, './__fixtures__/route.tcx')
      const routeParser = new RouteParser(file)
      const parsedRoute = routeParser.parse()
      expect(parsedRoute).toMatchSnapshot()
    })
  })

  describe('purifyTrackPoint()', () => {
    it('should leave only desired point properties', () => {
      const point = {
        Time: '2019-03-23T11:14:24.611Z',
        Position: {
          LatitudeDegrees: '53.79845833',
          LongitudeDegrees: '17.265445'
        },
        DistanceMeters: '177.10000610351562',
        AltitudeMeters: '150.20000610351562',
        HeartRateBpm: { Value: '103' },
        SensorState: 'Present'
      }
      const purifiedPoint = {
        Position: {
          LatitudeDegrees: '53.79845833',
          LongitudeDegrees: '17.265445'
        },
        DistanceMeters: '177.10000610351562',
        AltitudeMeters: '150.20000610351562'
      }
      const routeParser = new RouteParser()
      expect(routeParser.purifyTrackPoint(point)).toEqual(purifiedPoint)
    })

    it('should set AltitudeMeters to 0 when absent', () => {
      const point = {
        Time: '2019-03-23T11:14:24.611Z',
        Position: {
          LatitudeDegrees: '53.79845833',
          LongitudeDegrees: '17.265445'
        },
        DistanceMeters: '177.10000610351562',
        HeartRateBpm: { Value: '103' },
        SensorState: 'Present'
      }
      const purifiedPoint = {
        Position: {
          LatitudeDegrees: '53.79845833',
          LongitudeDegrees: '17.265445'
        },
        DistanceMeters: '177.10000610351562',
        AltitudeMeters: '0'
      }
      const routeParser = new RouteParser()
      expect(routeParser.purifyTrackPoint(point)).toEqual(purifiedPoint)
    })

    it('should throw when position is not defined', () => {
      const point = {
        Time: '2019-03-23T11:14:24.611Z',
        DistanceMeters: '177.10000610351562',
        HeartRateBpm: { Value: '103' },
        SensorState: 'Present'
      }
      const routeParser = new RouteParser()
      expect(() => routeParser.purifyTrackPoint(point)).toThrowError(
        'Point has no position'
      )
    })
  })
})
