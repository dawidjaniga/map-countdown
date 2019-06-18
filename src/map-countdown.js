import Countdown from './countdown'
import Map from './map/map'

export default class MapCountdown {
  constructor ({ selector, routePoints }) {
    this.countdown = new Countdown(selector)
    this.map = new Map({
      key: 'AIzaSyCYkWHZM0ZdO1JeJGBqo44wLlQz31lh-zM',
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
