/* global document, jest, describe, it, expect, beforeEach, afterAll */
import cloneDeep from 'lodash/cloneDeep'
import MapCountdown from '../src/map-countdown'
import routePoints from '../test/__fixtures__/routePoints'
import { WINDOW_ROUTE_POINTS_KEY } from '../src/constants'
import { ROUTE_OPTIONS_MISSING_ERROR } from '../src/texts'
jest.mock('../src/map/map')
jest.mock('../src/countdown')
const originalDocument = cloneDeep(document)

/* eslint-disable no-global-assign */
describe('MapCountdown', () => {
  const spiedConsole = jest.spyOn(console, 'error').mockImplementation()
  const key = 'google-generated-api-key'
  const options = {
    selector: '#countdown',
    key: key,
    meta: '2019-07-13 11:00:00'
  }

  beforeEach(() => {
    document = cloneDeep(originalDocument)
    window[WINDOW_ROUTE_POINTS_KEY] = routePoints
  })

  afterAll(() => {
    document = cloneDeep(originalDocument)
    spiedConsole.mockRestore()
    delete window[WINDOW_ROUTE_POINTS_KEY]
  })

  it('should construct MapCountdown in provided container', () => {
    document.body.innerHTML = `<div id="countdown"></div>`
    new MapCountdown(options) // eslint-disable-line no-new

    expect(document.body).toMatchSnapshot()
  })

  it('should delete routePoints from window', () => {
    document.body.innerHTML = `<div id="countdown"></div>`
    new MapCountdown(options) // eslint-disable-line no-new
    expect(window[WINDOW_ROUTE_POINTS_KEY]).not.toBeDefined()
  })

  it('updateMap() should run updatePolygons on Map', () => {
    document.body.innerHTML = `<div id="countdown"></div>`
    const mapCountdown = new MapCountdown(options)
    const args = {
      days: 1,
      hours: 2
    }
    mapCountdown.updateMap(args)
    expect(mapCountdown.map.updatePolygons).toBeCalledWith(
      ...Object.values(args)
    )
  })

  it('should print error in console when routePoints is missing', () => {
    delete window[WINDOW_ROUTE_POINTS_KEY]
    document.body.innerHTML = `<div id="countdown"></div>`
    new MapCountdown(options) // eslint-disable-line no-new

    expect(spiedConsole).toBeCalledWith(ROUTE_OPTIONS_MISSING_ERROR)
  })
})

/* eslint-enable no-global-assign */
