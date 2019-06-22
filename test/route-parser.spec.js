/* global jest, describe, it, expect, afterEach, beforeEach, afterAll */
import path from 'path'
import RouteParser from '../src/route-parser'
import * as CLI from '../src/bin/route-parser'
import fs from 'fs'

describe('route-parser', () => {
  let spiedWriteFileSync

  beforeEach(() => {
    spiedWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation()
  })

  afterAll(() => {
    spiedWriteFileSync.mockRestore()
  })

  describe('parse()', () => {
    it('should process parsing route', () => {
      const file = path.resolve(__dirname, './__fixtures__/route.tcx')
      const outputFilePath = 'routePoints.js'
      const routeParser = new RouteParser(file, outputFilePath)

      jest.spyOn(routeParser, 'parseFileToJson')
      jest.spyOn(routeParser, 'parsePoints')
      jest.spyOn(routeParser, 'saveFile')

      routeParser.parse()

      expect(routeParser.parseFileToJson).toHaveBeenCalledTimes(1)
      expect(routeParser.parseFileToJson).toHaveBeenCalledWith(file)
      expect(routeParser.parsePoints).toHaveBeenCalledTimes(1)
      expect(routeParser.parsePoints).toHaveBeenCalledWith(expect.any(Object))
      expect(routeParser.saveFile).toHaveBeenCalledTimes(1)
      expect(routeParser.saveFile).toHaveBeenCalledWith(
        outputFilePath,
        expect.anything()
      )
    })

    it('saveFile() should save file at given location', () => {
      const outputFilePath = 'routePoints.js'
      const routeParser = new RouteParser('', outputFilePath)
      const resolvedFilePath = path.resolve(outputFilePath)
      const data = { key: 'sampleData' }
      const encoding = 'utf8'
      routeParser.saveFile(outputFilePath, data)
      expect(spiedWriteFileSync).toHaveBeenCalledTimes(2)
      expect(spiedWriteFileSync).toHaveBeenCalledWith(
        resolvedFilePath,
        data,
        encoding
      )
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

  describe('CLI', () => {
    const originalArgv = process.argv
    const spiedConsole = jest.spyOn(console, 'log').mockImplementation()

    afterEach(() => {
      process.argv = originalArgv
    })

    afterAll(() => {
      spiedConsole.mockRestore()
    })

    it('main() should write correct string to stdout when file path is correct', () => {
      const { file, outputFilePath } = prepareFile()
      const successMessage = `✅ File ${file} successfully parsed and saved to ${path.resolve(
        outputFilePath
      )}`
      CLI.main()
      expect(spiedConsole).toBeCalledTimes(1)
      expect(spiedConsole).toBeCalledWith(successMessage)
    })

    it('main() should throw error when file path is incorrect', () => {
      prepareFile(false)
      expect(() => CLI.main()).toThrowError()
    })

    function prepareFile (correct = true) {
      const file = correct
        ? path.resolve(__dirname, './__fixtures__/route.tcx')
        : 'incorrect'
      const outputFilePath = correct ? 'routePoints.js' : 'incorrect'

      process.argv[2] = file
      process.argv[3] = outputFilePath

      return { file, outputFilePath }
    }
  })
})
