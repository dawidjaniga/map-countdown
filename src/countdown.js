export default class Countdown {
  constructor (containerSelector) {
    this.meta = new Date(2019, 6, 13, 11)
    this.oneDayMilliseconds = 86400000
    this.beginOfYear = new Date(this.meta.getFullYear(), 0, 0)
    this.metaDaysNumberDiff = this.meta - this.beginOfYear
    this.metaDayNumberInYear = Math.floor(
      this.metaDaysNumberDiff / this.oneDayMilliseconds
    )
    this.elements = {
      days: {
        testId: 'map-countdown-days'
      },
      hours: {
        testId: 'map-countdown-hours'
      },
      minutes: {
        testId: 'map-countdown-minutes'
      },
      seconds: {
        testId: 'map-countdown-seconds'
      }
    }
    this.containerEl = document.querySelector(containerSelector)
    const fragment = document.createDocumentFragment()

    Object.values(this.elements).forEach(item => {
      const element = this.createElement('div', item.testId)
      item.element = element
      fragment.appendChild(element)
    })

    this.containerEl.appendChild(fragment)
    this.events = {}
    this.recountTime()
    this.counterHandler = setInterval(() => this.recountTime(), 1000)
  }

  addEventListener (name, callback) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    this.events[name].push(callback)
    console.log('events:', this.events)
  }

  dispatchEvent (name, args) {
    const eventListeners = this.events[name]

    if (eventListeners) {
      eventListeners.forEach(listener => listener(args))
    }
  }

  createElement (tag, testId) {
    const element = document.createElement(tag)
    element.setAttribute('data-testid', testId)
    return element
  }

  setElementValue (name, value) {
    this.elements[name].element.innerHTML = value
  }

  recountTime () {
    var now = new Date()
    var diff = new Date(this.meta - now)
    var daysNumberDiff = new Date(now - this.beginOfYear)
    var currentDayNumberInYear = Math.floor(
      daysNumberDiff / this.oneDayMilliseconds
    )

    var days = this.metaDayNumberInYear - currentDayNumberInYear
    var hours = diff.getHours()
    var minutes = diff.getMinutes()
    var seconds = diff.getSeconds()
    var daysRatio = currentDayNumberInYear / this.metaDayNumberInYear
    var hoursRatio = diff.getHours() / 24
    var minutesRatio = diff.getMinutes() / 60
    var secondsRatio = diff.getSeconds() / 60

    this.dispatchEvent('countdown:recount', {
      days: daysRatio,
      hours: hoursRatio,
      minutes: minutesRatio,
      seconds: secondsRatio
    })

    this.setElementValue('days', days)
    this.setElementValue('hours', hours)
    this.setElementValue('minutes', minutes)
    this.setElementValue('seconds', seconds)
  }
}

// google.maps.event.addDomListener(window, 'load', function () {
//   var Map = createMap({
//     elementId: 'countdown-map',
//     disableDefaultUI: true
//   })
//   var Countdown = createCountdown()
//   var meta = new Date(2018, 6, 14, 11)
//   var oneDayMilliseconds = 86400000
//   var beginOfYear = new Date(meta.getFullYear(), 0, 0)
//   var metaDaysNumberDiff = meta - beginOfYear
//   var metaDayNumberInYear = Math.floor(metaDaysNumberDiff / oneDayMilliseconds)
//   Map.route.initCountdown()
// })
