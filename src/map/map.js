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

    window[this.callback] = () => {
      delete window[this.callback]
      this.loadMap(selector, options)
    }

    this.appendMapScriptToDocument()
  }
  updatePolygon (name, value) {
    // console.log('name:', name)
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
}
