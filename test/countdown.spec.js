/* global document, jest, describe, it, expect, afterEach */
import cloneDeep from 'lodash/cloneDeep'
import MockDate from 'mockdate'
import { getByTestId } from '@testing-library/dom'
import Countdown from '../src/countdown'
const originalDocument = cloneDeep(document)

/* eslint-disable no-global-assign */
describe('Countdown', () => {
  MockDate.set('2019-06-16')

  afterEach(() => {
    restoreDocument()
  })

  it('should construct MapCountdown in provided container', () => {
    document.body.innerHTML = `
    <div id="countdown"></div>
    `
    const countdown = new Countdown('#countdown')
    const containerEl = document.querySelector('#countdown')
    expect(countdown).toBeDefined()
    expect(containerEl).toMatchSnapshot()
  })

  it('should start timer', () => {
    document.body.innerHTML = `
    <div id="countdown"></div>
    `
    const countdown = new Countdown('#countdown')
    const elementName = 'hours'
    const value = 10
    countdown.setElementValue(elementName, value)

    const element = getByTestId(document, 'map-countdown-hours')
    expect(element).toHaveTextContent(value)
  })

  it.only('recountTime() should emit event "recount-time" with ratios', () => {
    document.body.innerHTML = `
    <div id="countdown"></div>
    `
    try {
      const countdown = new Countdown('#countdown')
      countdown.addEventListener('recount-time', function (data) {
        console.log('event:', data)
        expect(data).toMatchSnapshot()
      })
      countdown.recountTime()
    } catch (e) {
      console.log('e:', e)
    }
  })

  it('should start setInterval', () => {
    jest.useFakeTimers()

    document.body.innerHTML = `
    <div id="countdown"></div>
    `
    // expect.assertions(3)
    const countdown = new Countdown('#countdown')
    jest.advanceTimersByTime(2000)
    console.log('countdown rec:', countdown.recountTime)
    const spy = jest.spyOn(countdown, 'recountTime')

    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(3)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
  })
})

function restoreDocument () {
  document = cloneDeep(originalDocument)
}
/* eslint-enable no-global-assign */
