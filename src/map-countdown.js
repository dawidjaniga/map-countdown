import Countdown from './countdown'
import Map from './map'

export default class MapCountdown {
  constructor (containerSelector) {
    this.countdown = new Countdown(containerSelector)
    this.map = new Map({
      key: 'AIzaSyCYkWHZM0ZdO1JeJGBqo44wLlQz31lh-zM',
      selector: '#map',
      options: {
        center: {
          lat: 40.7484405,
          lng: -73.9944191
        },
        zoom: 12
      }
    })
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
