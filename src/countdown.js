export default class Countdown {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.countdownContainer = document.createElement('div')
    this.countdownContainer.classList.add('map-countdown__countdown')
    this.meta = new Date(2019, 6, 13, 11)
    this.oneDayMilliseconds = 86400000
    this.beginOfYear = new Date(this.meta.getFullYear(), 0, 0)
    this.metaDaysNumberDiff = this.meta - this.beginOfYear
    this.metaDayNumberInYear = Math.floor(
      this.metaDaysNumberDiff / this.oneDayMilliseconds
    )
    this.elements = {
      days: {
        testId: 'map-countdown-days',
        text: 'Dni'
      },
      hours: {
        testId: 'map-countdown-hours',
        text: 'Godzin'
      },
      minutes: {
        testId: 'map-countdown-minutes',
        text: 'Minut'
      },
      seconds: {
        testId: 'map-countdown-seconds',
        text: 'Sekund'
      }
    }

    const fragment = document.createDocumentFragment()

    Object.keys(this.elements).forEach(itemName => {
      const elementFragment = document.createDocumentFragment()
      const item = this.elements[itemName]
      const element = document.createElement('div')
      const number = this.createElement('div', item.testId)
      const text = document.createElement('h4')
      element.classList.add('map-countdown__item')
      text.classList.add('map-countdown__label')
      text.textContent = item.text
      elementFragment.appendChild(element)
      element.appendChild(number)
      element.appendChild(text)

      number.classList.add(
        'map-countdown__number',
        `map-countdown__number--${itemName}`
      )
      fragment.appendChild(elementFragment)
      item.element = element
    })

    this.countdownContainer.appendChild(fragment)
    this.containerElement.appendChild(this.countdownContainer)
    this.events = {}
    this.recountTime()
    this.counterHandler = setInterval(() => this.recountTime(), 1000)
  }

  addEventListener (name, callback) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    this.events[name].push(callback)
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
    const number = this.elements[name].element.querySelector('div')
    number.textContent = value
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
