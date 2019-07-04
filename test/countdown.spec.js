/* global document, jest, describe, it, expect, beforeEach, afterEach */
import MockDate from 'mockdate'
import { getByTestId } from '@testing-library/dom'
import Countdown from '../src/countdown'

/* eslint-disable no-global-assign */
describe('Countdown', () => {
  const translations = {
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
  const polishTranslations = {
    days: {
      one: 'Dzień',
      many: 'Dni'
    },
    hours: {
      one: 'Godzina',
      many: 'Godzin'
    },
    minutes: {
      one: 'Minuta',
      many: 'Minut'
    },
    seconds: {
      one: 'Sekunda',
      many: 'Sekund'
    },
    afterCountdown: 'Wydarzenie już się odbyło'
  }

  beforeEach(() => {
    MockDate.set('2019-06-16')
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should construct Countdown in provided container', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00'
    })
    expect(countdown).toBeDefined()
    expect(containerElement).toMatchSnapshot()
  })

  it('addEvenListener() should add listener', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const eventName = 'event:name'
    const listener = jest.fn()

    countdown.addEventListener(eventName, listener)
    expect(countdown.events[eventName]).toContain(listener)
  })

  it('addEvenListener() should add a listener', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const eventName = 'event:name'
    const firstListener = jest.fn()
    const secondListener = jest.fn()

    countdown.addEventListener(eventName, firstListener)
    countdown.addEventListener(eventName, secondListener)
    expect(countdown.events[eventName]).toContain(firstListener, secondListener)
  })

  it('dispatchEvent() should dispatch an event passing args', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const eventName = 'event:name'
    const firstListener = jest.fn()
    const args = {
      key: 'name'
    }

    countdown.addEventListener(eventName, firstListener)
    countdown.dispatchEvent(eventName, args)
    expect(firstListener).toBeCalled()
    expect(firstListener).toBeCalledWith(args)
  })

  it('should start setInterval', () => {
    jest.useFakeTimers()
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00'
    })
    jest.spyOn(countdown, 'recountTime')
    jest.advanceTimersByTime(2000)

    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    expect(countdown.recountTime).toHaveBeenCalledTimes(2)
  })

  it('recountTime() should emit event "countdown:recount" with ratios', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const eventName = 'countdown:recount'
    const listener = jest.fn()
    countdown.addEventListener(eventName, listener)
    countdown.recountTime()

    expect(listener).toBeCalled()
    expect(listener).toBeCalledWith(
      expect.objectContaining({
        days: expect.any(Number),
        hours: expect.any(Number),
        minutes: expect.any(Number),
        seconds: expect.any(Number)
      })
    )
  })

  it('should render default translations', () => {
    const containerElement = document.createElement('div')
    const options = {
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    }
    new Countdown(options) // eslint-disable-line no-new
    expect(containerElement).toMatchSnapshot()
  })

  it('should render passed translations', () => {
    const containerElement = document.createElement('div')
    const options = {
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations: polishTranslations
    }
    new Countdown(options) // eslint-disable-line no-new
    expect(containerElement).toMatchSnapshot()
  })

  it('should render afterCountdown translation when countdown finishes', () => {
    MockDate.set('2019-10-16')
    const containerElement = document.createElement('div')
    const options = {
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    }
    new Countdown(options) // eslint-disable-line no-new
    const element = getByTestId(containerElement, 'map-countdown-title')
    expect(element).toHaveTextContent(translations.afterCountdown)
  })

  it('setElementValue() should render label "one" when value is 1', () => {
    const containerElement = document.createElement('div')
    const value = 1
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const element = getByTestId(containerElement, 'map-countdown-hours')
    countdown.setElementValue('hours', value)

    expect(element).toHaveTextContent(`${value}${translations.hours.one}`)
    expect(containerElement).toMatchSnapshot()
  })

  it('setElementValue() should render label "many" when value is greater than 1', () => {
    const containerElement = document.createElement('div')
    const value = 5
    const countdown = new Countdown({
      containerElement,
      meta: '2019-07-13 11:00:00',
      translations
    })
    const element = getByTestId(containerElement, 'map-countdown-hours')
    countdown.setElementValue('hours', value)
    expect(element).toHaveTextContent(`${value}${translations.hours.many}`)
    expect(containerElement).toMatchSnapshot()
  })
})
/* eslint-enable no-global-assign */
