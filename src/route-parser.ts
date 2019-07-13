import fs from 'fs'
import path from 'path'
import parser from 'xml2json'
import { WINDOW_ROUTE_POINTS_KEY } from './constants'

interface Workout {
  TrainingCenterDatabase: {
    Activities: {
      Activity: {
        Lap: {
          Track: {
            Trackpoint: Point[]
          }
        }
      }
    }
  }
}

interface Point {
  Position: {
    LatitudeDegrees: string,
    LongitudeDegrees: string
  },
  DistanceMeters: string
  AltitudeMeters: string
}

export default class RouteParser {
  constructor(private file: string, private outputFilePath: string) { }

  parse() {
    const parsedFile = this.parseFileToJson(this.file)
    this.saveFile(
      this.outputFilePath,
      this.makeWindowAttachable(this.parsePoints(parsedFile))
    )
  }

  parseFileToJson(file: string): Workout {
    const xml = fs.readFileSync(file, 'utf8')
    return JSON.parse(parser.toJson(xml))
  }

  makeWindowAttachable(data: object) {
    return `window.${WINDOW_ROUTE_POINTS_KEY} = ${JSON.stringify(data)}`
  }

  saveFile(file: string, data: string) {
    const a = path.resolve(file)
    return fs.writeFileSync(a, data, 'utf8')
  }

  parsePoints(parsedFile: Workout) {
    const points =
      parsedFile.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint
    const hasDefinedDistance = (point: Point) => point.DistanceMeters
    return points
      .filter(hasDefinedDistance)
      .map((point: Point) => this.purifyTrackPoint(point))
  }

  purifyTrackPoint(point: Point) {
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
