import Countdown from './countdown'
import MapClass from './map'

export default class MapCountdown {
  constructor (containerSelector) {
    this.countdown = new Countdown(containerSelector)
    this.map = new MapClass()
    this.countdown.addEventListener(
      'countdown:recount',
      this.updateMap.bind(this)
    )
  }

  updateMap (ratios) {
    Object.keys(ratios).forEach(name => {
      this.map.updatePolygon(name, ratios[name])
    })
  }
}
