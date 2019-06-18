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
  constructor ({ key, selector, options }) {
    this.key = key
    this.callback = '__MapCountdownLoadMap'
    this.libraries = ['drawing']
    this.routePoints = []
    this.secondsPolyline = {}
    this.minutesPolyline = {}
    this.hoursPolyline = {}
    this.daysPolyline = {}

    window[this.callback] = () => {
      delete window[this.callback]
      this.loadMap(selector, options)
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

  loadMap (mapContainerSelector, options = {}) {
    const defaultOptions = {
      zoom: 14,
      center: {
        lat: 53.79061631330304,
        lng: 17.242156863212585
      },
      backgroundColor: COLORS.MAP_BACKGROUND,
      mapTypeId: 'terrain',
      scrollwheel: false,
      styles: mapStyle
    }

    this.map = new google.maps.Map(
      document.querySelector(mapContainerSelector),
      { ...defaultOptions, ...options }
    )
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
  }

  getRoutePoints (points) {
    return this.routePoints
  }

  updatePolygons (days, hours, minutes, seconds) {
    const maxDistance = 10003
    var daysPath = []

    var hoursPath = []

    var minutesPath = []

    var secondsPath = []

    this.routePoints.forEach(function (point) {
      var distance = point.DistanceMeters[0]
      var position = new google.maps.LatLng({
        lat: parseFloat(point.Position[0].LatitudeDegrees[0]),
        lng: parseFloat(point.Position[0].LongitudeDegrees[0])
      })

      var secondsMeters = parseFloat((1 - seconds) * maxDistance)
      var minutesMeters = parseFloat((1 - minutes) * maxDistance)
      var hoursMeters = parseFloat((1 - hours) * maxDistance)
      var daysMeters = parseFloat((1 - days) * maxDistance)

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
