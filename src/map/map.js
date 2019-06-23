/* global google */
import mapStyle from './styles.js'

const COLORS = {
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
}
export default class Map {
  constructor ({ key, containerElement, options }) {
    this.key = key
    this.callback = '__MapCountdownLoadMap'
    this.libraries = ['drawing']
    this.routePoints = []
    this.maxDistance = 0
    this.secondsPolyline = {}
    this.minutesPolyline = {}
    this.hoursPolyline = {}
    this.daysPolyline = {}
    this.mapContainer = document.createElement('div')
    this.mapContainer.classList.add('map-countdown__map')
    containerElement.appendChild(this.mapContainer)

    window[this.callback] = () => {
      delete window[this.callback]
      this.loadMap(this.mapContainer, options)
      this.initPolygons()
    }

    this.appendMapScriptToDocument()
  }

  appendMapScriptToDocument () {
    document.body.appendChild(this.createMapScript())
  }

  createMapScript () {
    const script = document.createElement('script')
    script.setAttribute(
      'src',
      `https://maps.googleapis.com/maps/api/js?key=${this.key}&callback=${
        this.callback
      }&libraries=${this.libraries}`
    )
    script.setAttribute('defer', true)
    script.setAttribute('async', true)

    return script
  }

  getMapContainer () {
    return this.mapContainer
  }

  loadMap (mapContainer, options = {}) {
    const defaultOptions = {
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
    }

    this.map = new google.maps.Map(mapContainer, {
      ...defaultOptions,
      ...options
    })

    window.map = this.map
  }

  initPolygons () {
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

  setRoutePoints (points) {
    this.routePoints = points
    this.maxDistance = Math.max(...points.map(point => point.DistanceMeters))
  }

  getRoutePoints (points) {
    return this.routePoints
  }

  updatePolygons (days, hours, minutes, seconds) {
    const maxDistance = 10003
    const daysPath = []
    const hoursPath = []
    const minutesPath = []
    const secondsPath = []

    this.routePoints.forEach(function (point) {
      const position = new google.maps.LatLng({
        lat: parseFloat(point.Position.LatitudeDegrees),
        lng: parseFloat(point.Position.LongitudeDegrees)
      })
      const distance = point.DistanceMeters
      const secondsMeters = parseFloat((1 - seconds) * maxDistance)
      const minutesMeters = parseFloat((1 - minutes) * maxDistance)
      const hoursMeters = parseFloat((1 - hours) * maxDistance)
      const daysMeters = parseFloat((1 - days) * maxDistance)

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

    this.secondsPolyline.setPath(secondsPath)
    this.minutesPolyline.setPath(minutesPath)
    this.hoursPolyline.setPath(hoursPath)
    this.daysPolyline.setPath(daysPath)
  }
}
