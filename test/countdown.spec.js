/* global document, jest, describe, it, expect, afterEach */
import cloneDeep from 'lodash/cloneDeep'
import MockDate from 'mockdate'
import { getByTestId } from '@testing-library/dom'
import Countdown from '../src/countdown'
const originalDocument = cloneDeep(document)

/* eslint-disable no-global-assign */
describe('Countdown', () => {
  MockDate.set('2019-06-16', 0)

  afterEach(() => {
    restoreDocument()
  })

  it('should construct MapCountdown in provided container', () => {
    const container = document.createElement('div')
    const countdown = new Countdown(container)
    expect(countdown).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  it('should start timer', () => {
    const containerElement = document.createElement('div')
    const countdown = new Countdown(containerElement)
    const elementName = 'hours'
    const value = 10
    countdown.setElementValue(elementName, value)

    const element = getByTestId(containerElement, 'map-countdown-hours')
    expect(element).toHaveTextContent(value)
  })

  it.skip('recountTime() should emit event "recount-time" with ratios', () => {
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
    const containerElement = document.createElement('div')
    new Countdown(containerElement) // eslint-disable-line no-new

    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
  })
})

function restoreDocument () {
  document = cloneDeep(originalDocument)
}
/* eslint-enable no-global-assign */
