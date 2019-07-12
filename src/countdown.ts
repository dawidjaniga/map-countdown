const defaultTranslations = {
  daysOne: 'Day',
  daysMany: 'Days',
  hoursOne: 'Hour',
  hoursMany: 'Hours',
  minutesOne: 'Minute',
  minutesMany: 'Minutes',
  secondsOne: 'Second',
  secondsMany: 'Seconds',
  afterCountdown: 'The event has already took place'
}

interface ICountdownSettings {
  containerElement: HTMLElement,
  meta: string,
  translations: object,
}

interface MapLike<T> {
  [key: string]: T
}

type Element = {
  testId: string,
  element: HTMLElement,
  number: HTMLElement,
  label: HTMLElement
}

type Elements = {
  [index: string]: Element
}

type Event = () => void

type Events = {
  [index: string]: Array<Event>
}

type PluralTranslation = {
  one: string,
  many: string,
}

type Translations = {
  [key: string]: string
}


export default class Countdown {
  private containerElement: HTMLElement
  private translations: Translations
  private countdownContainer: HTMLElement
  private meta: Date
  private oneDayMilliseconds: number
  private beginOfYear: Date
  private metaDaysNumberDiff: number
  private metaDayNumberInYear: number
  private elements: Elements
  private events: Events
  private counterHandler: number

  constructor({ containerElement, meta, translations }: ICountdownSettings) {
    this.containerElement = containerElement
    this.translations = { ...defaultTranslations, ...translations }
    this.elements = {}
    this.countdownContainer = document.createElement('div')
    this.countdownContainer.classList.add('map-countdown__countdown')
    this.meta = new Date(meta)
    this.oneDayMilliseconds = 86400000
    this.beginOfYear = new Date(this.meta.getFullYear(), 0, 0)
    this.metaDaysNumberDiff = this.meta.valueOf() - this.beginOfYear.valueOf()
    this.metaDayNumberInYear = Math.floor(
      this.metaDaysNumberDiff / this.oneDayMilliseconds
    )
    const fragment = document.createDocumentFragment()
    const elements = ['days', 'hours', 'minutes', 'seconds']

    elements.forEach((itemName: string) => {
      const elementFragment = document.createDocumentFragment()
      const item = this.elements[itemName]
      const testId = `map-countdown-${itemName}`
      const element = this.createElement('div', testId)
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
      this.elements[itemName] = {
        element: element,
        number: number,
        label: label,
        testId
      }
    })

    this.countdownContainer.appendChild(fragment)
    this.containerElement.appendChild(this.countdownContainer)
    this.events = {}
    this.recountTime()
    this.counterHandler = window.setInterval(() => this.recountTime(), 1000)
  }

  addEventListener(name: string, callback: () => void) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    this.events[name].push(callback)
  }

  dispatchEvent(name: string, data: object) {
    const eventListeners = this.events[name]

    if (eventListeners) {
      eventListeners.forEach((listener: (data: object) => void) => listener(data))
    }
  }

  createElement(tag: string, testId: string) {
    const element = document.createElement(tag)
    element.setAttribute('data-testid', testId)
    return element
  }

  setElementValue(name: string, value: number) {
    const element = this.elements[name]
    const translationKey = value === 1 ? `${name}One` : `${name}Many`
    const label = this.translations[translationKey]
    element.number.textContent = String(value)
    element.label.textContent = label
  }

  recountTime() {
    const now = new Date()
    const timeLeft = this.meta.valueOf() - now.valueOf()
    const countdownFinished = timeLeft < 0
    const timeLeftDate = new Date(timeLeft)
    const daysNumberDiff = new Date(now.valueOf() - this.beginOfYear.valueOf())
    const currentDayNumberInYear = Math.floor(
      daysNumberDiff.valueOf() / this.oneDayMilliseconds
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

  finishCountdown() {
    const afterCountdown = this.createElement('h2', 'map-countdown-title')
    afterCountdown.classList.add('map-countdown__title')
    afterCountdown.textContent = this.translations.afterCountdown
    clearInterval(this.counterHandler)
    this.countdownContainer.innerHTML = ''
    this.countdownContainer.appendChild(afterCountdown)
  }
}
