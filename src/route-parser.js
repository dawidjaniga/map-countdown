import fs from 'fs'
import parser from 'xml2json'

export default class RouteParser {
  constructor (file) {
    this.file = file
  }

  parse () {
    const parsedFile = this.parseFileToJson(this.file)
    return this.parsePoints(parsedFile)
  }

  parseFileToJson (file) {
    const xml = fs.readFileSync(file, 'utf8')
    return JSON.parse(parser.toJson(xml))
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
