import Countdown, { Ratios } from './countdown'
import Map from './map/map'
import { WINDOW_ROUTE_POINTS_KEY } from './constants'
import { ROUTE_OPTIONS_MISSING_ERROR, CONTAINER_SELECTOR_ERROR } from './texts'
import './style.css'

interface MapCountdownSettings {
  selector: string,
  key: string,
  meta: string,
  translations: object,
}

export default class MapCountdown {
  containerElement: HTMLElement | null
  countdown!: Countdown
  map!: Map

  constructor({ selector, key, meta, translations }: MapCountdownSettings) {
    this.containerElement = document.querySelector(selector)

    if (!window[WINDOW_ROUTE_POINTS_KEY]) {
      console.error(ROUTE_OPTIONS_MISSING_ERROR)
      return
    }

    if (!this.containerElement) {
      console.error(CONTAINER_SELECTOR_ERROR)
      return
    }

    this.containerElement.classList.add('map-countdown')
    this.countdown = new Countdown({
      containerElement: this.containerElement,
      meta,
      translations
    })
    this.map = new Map({
      key,
      containerElement: this.containerElement
    })
    this.map.setRoutePoints(window[WINDOW_ROUTE_POINTS_KEY])
    this.attachEvents()

    delete window[WINDOW_ROUTE_POINTS_KEY]
  }
  attachEvents() {
    this.countdown.addEventListener(
      'countdown:recount',
      this.updateMap.bind(this)
    )
  }

  updateMap(ratios: Ratios) {
    this.map.updatePolygons(ratios)
  }
}
