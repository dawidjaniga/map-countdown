import Countdown from './countdown'
import Map from './map/map'

export default class MapCountdown {
  constructor ({ selector, routePoints, key }) {
    this.countdown = new Countdown(selector)
    this.map = new Map({
      key,
      selector: '#map'
    })
    this.map.setRoutePoints(routePoints)
    this.countdown.addEventListener(
      'countdown:recount',
      this.updateMap.bind(this)
    )
  }

  updateMap (ratios) {
    this.map.updatePolygons(...Object.values(ratios))
  }
}
