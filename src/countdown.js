const defaultTranslations = {
  days: {
    one: 'Day',
    many: 'Days'
  },
  hours: {
    one: 'Hour',
    many: 'Hours'
  },
  minutes: {
    one: 'Minute',
    many: 'Minutes'
  },
  seconds: {
    one: 'Second',
    many: 'Seconds'
  },
  afterCountdown: 'The event has already took place'
}

export default class Countdown {
  constructor ({ containerElement, meta, translations }) {
    this.containerElement = containerElement
    this.translations = { ...defaultTranslations, ...translations }
    this.countdownContainer = document.createElement('div')
    this.countdownContainer.classList.add('map-countdown__countdown')
    this.meta = new Date(meta)
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

    const fragment = document.createDocumentFragment()

    Object.keys(this.elements).forEach(itemName => {
      const elementFragment = document.createDocumentFragment()
      const item = this.elements[itemName]
      const element = this.createElement('div', item.testId)
      const number = document.createElement('div')
      const label = document.createElement('h4')
      element.classList.add('map-countdown__item')
      label.classList.add('map-countdown__label')
      elementFragment.appendChild(element)
      element.appendChild(number)
      element.appendChild(label)

      number.classList.add(
        'map-countdown__number',
        `map-countdown__number--${itemName}`
      )
      fragment.appendChild(elementFragment)
      item.element = element
      item.number = number
      item.label = label
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
    const element = this.elements[name]
    const translations = this.translations[name]
    const label = value === 1 ? translations.one : translations.many
    element.number.textContent = value
    element.label.textContent = label
  }

  recountTime () {
    const now = new Date()
    const timeLeft = this.meta - now
    const countdownFinished = timeLeft < 0
    const timeLeftDate = new Date(timeLeft)
    const daysNumberDiff = new Date(now - this.beginOfYear)
    const currentDayNumberInYear = Math.floor(
      daysNumberDiff / this.oneDayMilliseconds
    )

    if (countdownFinished) {
      this.finishCountdown()
    } else {
      const days = this.metaDayNumberInYear - currentDayNumberInYear
      const hours = timeLeftDate.getHours()
      const minutes = timeLeftDate.getMinutes()
      const seconds = timeLeftDate.getSeconds()
      const daysRatio = currentDayNumberInYear / this.metaDayNumberInYear
      const hoursRatio = timeLeftDate.getHours() / 24
      const minutesRatio = timeLeftDate.getMinutes() / 60
      const secondsRatio = timeLeftDate.getSeconds() / 60

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

  finishCountdown () {
    const afterCountdown = this.createElement('h2', 'map-countdown-title')
    afterCountdown.classList.add('map-countdown__title')
    afterCountdown.textContent = this.translations.afterCountdown
    clearInterval(this.counterHandler)
    this.countdownContainer.innerHTML = ''
    this.countdownContainer.appendChild(afterCountdown)
  }
}
