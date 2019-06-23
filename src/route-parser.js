import fs from 'fs'
import path from 'path'
import parser from 'xml2json'
import { WINDOW_ROUTE_POINTS_KEY } from './constants'
export default class RouteParser {
  constructor (file, outputFilePath) {
    this.file = file
    this.outputFilePath = outputFilePath
  }

  parse () {
    const parsedFile = this.parseFileToJson(this.file)
    this.saveFile(
      this.outputFilePath,
      this.makeWindowAttachable(this.parsePoints(parsedFile))
    )
  }

  parseFileToJson (file) {
    const xml = fs.readFileSync(file, 'utf8')
    return JSON.parse(parser.toJson(xml))
  }

  makeWindowAttachable (data) {
    return `window.${WINDOW_ROUTE_POINTS_KEY} = ${JSON.stringify(data)}`
  }

  saveFile (file, data) {
    const a = path.resolve(file)
    return fs.writeFileSync(a, data, 'utf8')
  }

  parsePoints (parsedFile) {
    const points =
      parsedFile.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint
    const hasDefinedDistance = point => point.DistanceMeters
    return points
      .filter(hasDefinedDistance)
      .map(point => this.purifyTrackPoint(point))
  }

  purifyTrackPoint (point) {
    const position = point.Position || {}

    if (!point.Position) {
      throw new Error('Point has no position')
    }

    return {
      Position: {
        LatitudeDegrees: position.LatitudeDegrees,
        LongitudeDegrees: position.LongitudeDegrees
      },
      DistanceMeters: point.DistanceMeters,
      AltitudeMeters: point.AltitudeMeters || '0'
    }
  }
}
