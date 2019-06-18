/* global document, jest, describe, it, expect, afterEach, afterAll */
import cloneDeep from 'lodash/cloneDeep'
import createGoogleMapsMock from 'jest-google-maps-mock'
import Map from '../src/map/map'
import mapStyle from '../src/map/styles'
import routePoints from '../test/__fixtures__/routePoints'

const COLORS = {
  RUNDA_MAIN: '#afd02a',
  FORESTGREEN: '#228B22',
  MAP_BACKGROUND: '#333333',
  DAYS: '#252d11',
  HOURS: '#643627',
  MINUTES: '#822d76',
  SECONDS: '#afd02a',
  ROUTE_1: '#ED7296',
  ROUTE_2: '#7072CF',
  ROUTE_3: '#FFF1CE',
  ROUTE_4: '#FF9311',
  ROUTE_5: '#D64700',
  ROUTE_6: '#2980B9'
}

const originalDocument = cloneDeep(document)
const originalGoogle = cloneDeep(global.window.google)

/* eslint-disable no-global-assign */
describe('Map', () => {
  global.window.google = {}
  const key = 'google-generated-api-key'
  const callback = '__MapCountdownLoadMap'
  const libraries = ['drawing']
  const mapId = 'map'
  const selector = `#${mapId}`
  const defaultOptions = {
    zoom: 14,
    center: {
      lat: 53.79061631330304,
      lng: 17.242156863212585
    },
    backgroundColor: COLORS.MAP_BACKGROUND,
    mapTypeId: 'terrain',
    scrollwheel: false,
    styles: mapStyle
  }
  const options = {
    center: {
      lat: 40.7484405,
      lng: -73.9944191
    },
    zoom: 12
  }

  afterEach(() => {
    document = cloneDeep(originalDocument)
    global.window.google.maps = createGoogleMapsMock()
  })

  afterAll(() => {
    global.window.google = cloneDeep(originalGoogle)
  })

  it('should append Google Maps script to body', () => {
    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callback}&libraries=${libraries}`
    new Map({ key, callback, libraries }) // eslint-disable-line no-new

    expect(document.scripts).toContainEqual(expect.objectContaining({ src }))
  })

  it('loadMap() should load Google Map with default options into container', () => {
    const map = new Map({ key })
    const mapElement = document.createElement('div')
    mapElement.setAttribute('id', mapId)
    document.body.appendChild(mapElement)
    map.loadMap(selector)

    expect(global.window.google.maps.Map).toHaveBeenCalledTimes(1)
    expect(global.window.google.maps.Map.mock.instances.length).toBe(1)
    expect(global.window.google.maps.Map).toHaveBeenLastCalledWith(mapElement, {
      ...defaultOptions
    })
  })

  it('loadMap() should load Google Map with merged options into container', () => {
    const map = new Map({ key })
    const mapElement = document.createElement('div')
    mapElement.setAttribute('id', mapId)
    document.body.appendChild(mapElement)
    map.loadMap(selector, options)

    expect(global.window.google.maps.Map).toHaveBeenCalledTimes(1)
    expect(global.window.google.maps.Map.mock.instances.length).toBe(1)
    expect(global.window.google.maps.Map).toHaveBeenLastCalledWith(mapElement, {
      ...defaultOptions,
      ...options
    })
  })

  it('Google Maps callback should invoke loadMap() and destroy itself', () => {
    const map = new Map({ key, selector, options }) // eslint-disable-line no-unused-vars
    const spy = jest.spyOn(map, 'loadMap')

    expect(window[callback]).toBeDefined()
    window[callback]()
    expect(window[callback]).not.toBeDefined()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(selector, options)
  })

  it('setRoutePoints() should set route points', () => {
    const map = new Map({ key })
    map.setRoutePoints(routePoints)

    expect(map.getRoutePoints()).toEqual(routePoints)
  })
})

/* eslint-enable no-global-assign */
