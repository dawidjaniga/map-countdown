/* global google */
import { mapStyle } from './styles'
import { Ratios } from '../countdown';

const COLORS = {
  MAP_BACKGROUND: '#333333',
  DAYS: '#252d11',
  HOURS: '#643627',
  MINUTES: '#822d76',
  SECONDS: '#afd02a',
}

interface MapSettings {
  key: string,
  containerElement: HTMLElement,
  options?: object,
}

interface Point {
  DistanceMeters: string,
  Position: {
    LatitudeDegrees: string,
    LongitudeDegrees: string
  }
}

declare global {
  interface Window {
    [index: string]: any,
    map: google.maps.Map | undefined
  }
}

export default class Map {
  private key: string
  private mapContainer: HTMLElement
  private callback: string
  private libraries: Array<string>
  private routePoints: Point[]
  private maxDistance: number
  private secondsPolyline?: google.maps.Polyline
  private minutesPolyline?: google.maps.Polyline
  private hoursPolyline?: google.maps.Polyline
  private daysPolyline?: google.maps.Polyline
  private map?: google.maps.Map

  constructor({ key, containerElement, options }: MapSettings) {
    this.key = key
    this.callback = '__MapCountdownLoadMap'
    this.libraries = ['drawing']
    this.routePoints = []
    this.maxDistance = 0
    this.mapContainer = document.createElement('div')
    this.mapContainer.classList.add('map-countdown__map')
    containerElement.appendChild(this.mapContainer)

    window[this.callback] = () => {
      delete window[this.callback]
      this.loadMap(this.mapContainer, options)
      this.initPolygons()
    }

    if (!window.google || !window.google.hasOwnProperty('maps')) {
      this.appendMapScriptToDocument()
    }
  }

  appendMapScriptToDocument() {
    document.body.appendChild(this.createMapScript())
  }

  createMapScript() {
    const script = document.createElement('script')
    script.setAttribute(
      'src',
      `https://maps.googleapis.com/maps/api/js?key=${this.key}&callback=${
      this.callback
      }&libraries=${this.libraries}`
    )
    script.setAttribute('defer', "true")
    script.setAttribute('async', "true")

    return script
  }

  getMapContainer() {
    return this.mapContainer
  }

  loadMap(mapContainer: HTMLElement, options = {}) {
    const mapTypeStyle: google.maps.MapTypeStyle[] = mapStyle
    const defaultOptions = {
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
    }

    this.map = new google.maps.Map(mapContainer, {
      ...defaultOptions,
      ...options
    })
  }

  initPolygons() {
    this.daysPolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: COLORS.DAYS,
      strokeWeight: 10
    })

    this.hoursPolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: COLORS.HOURS,
      strokeWeight: 5
    })

    this.minutesPolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: COLORS.MINUTES,
      strokeWeight: 5
    })

    this.secondsPolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: COLORS.SECONDS,
      strokeWeight: 1
    })
  }

  setRoutePoints(points: Point[]) {
    this.routePoints = points
    this.maxDistance = Math.max(...points.map(point => parseFloat(point.DistanceMeters)))
  }

  getRoutePoints() {
    return this.routePoints
  }

  updatePolygons(ratios: Ratios) {
    const {
      days,
      hours,
      minutes,
      seconds,
    } = ratios
    const daysPath: google.maps.LatLng[] = []
    const hoursPath: google.maps.LatLng[] = []
    const minutesPath: google.maps.LatLng[] = []
    const secondsPath: google.maps.LatLng[] = []

    this.routePoints.forEach((point: Point) => {
      const position = new google.maps.LatLng({
        lat: parseFloat(point.Position.LatitudeDegrees),
        lng: parseFloat(point.Position.LongitudeDegrees)
      })
      const distance = parseFloat(point.DistanceMeters)
      const secondsMeters = (1 - seconds) * this.maxDistance
      const minutesMeters = (1 - minutes) * this.maxDistance
      const hoursMeters = (1 - hours) * this.maxDistance
      const daysMeters = (1 - days) * this.maxDistance

      if (distance < secondsMeters) {
        secondsPath.push(position)
      }

      if (distance < minutesMeters) {
        minutesPath.push(position)
      }

      if (distance < hoursMeters) {
        hoursPath.push(position)
      }

      if (distance < daysMeters) {
        daysPath.push(position)
      }
    })

    if (this.secondsPolyline) {
      this.secondsPolyline.setPath(secondsPath)
    }

    if (this.minutesPolyline) {
      this.minutesPolyline.setPath(minutesPath)
    }

    if (this.hoursPolyline) {
      this.hoursPolyline.setPath(hoursPath)
    }

    if (this.daysPolyline) {
      this.daysPolyline.setPath(daysPath)
    }
  }
}
