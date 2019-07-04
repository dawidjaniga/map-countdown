/* global document, jest, describe, it, expect, beforeEach, afterAll */
import cloneDeep from 'lodash/cloneDeep'
import createGoogleMapsMock from 'jest-google-maps-mock'
import Map from '../src/map/map'
import mapStyle from '../src/map/styles'
import routePoints from '../test/__fixtures__/routePoints'
import { JSDOM } from 'jsdom'
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

/* eslint-disable no-global-assign */
describe('Map', () => {
  global.google = {}
  const key = 'google-generated-api-key'
  const callback = '__MapCountdownLoadMap'
  const libraries = ['drawing']
  const defaultOptions = {
    zoom: 14,
    center: {
      lat: 53.79564218580562,
      lng: 17.285329699516296
    },
    backgroundColor: COLORS.MAP_BACKGROUND,
    mapTypeId: 'roadmap',
    scrollwheel: false,
    styles: mapStyle,
    disableDefaultUI: true
  }
  const options = {
    center: {
      lat: 40.7484405,
      lng: -73.9944191
    },
    zoom: 12
  }

  beforeEach(() => {
    document.querySelector('html').innerHTML = ''
    global.google.maps = createGoogleMapsMock()
  })

  it('should append Google Maps script to body', () => {
    global.google = {}
    const containerElement = document.createElement('div')
    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callback}&libraries=${libraries}`
    new Map({ key, callback, containerElement }) // eslint-disable-line no-new

    expect(document.scripts).toContainEqual(expect.objectContaining({ src }))
  })

  it('should not load Google Maps when already existed', () => {
    const containerElement = document.createElement('div')
    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callback}&libraries=${libraries}`
    new Map({ key, callback, containerElement }) // eslint-disable-line no-new

    expect(document.scripts).not.toContainEqual(
      expect.objectContaining({ src })
    )
  })

  it('loadMap() should load Google Map with default options into container', () => {
    const containerElement = document.createElement('div')
    const map = new Map({ key, containerElement })
    const mapElement = document.createElement('div')
    map.loadMap(mapElement)

    expect(global.google.maps.Map).toHaveBeenCalledTimes(1)
    expect(global.google.maps.Map.mock.instances.length).toBe(1)
    expect(global.google.maps.Map).toHaveBeenLastCalledWith(mapElement, {
      ...defaultOptions
    })
  })

  it('loadMap() should load Google Map with merged options into container', () => {
    const containerElement = document.createElement('div')
    const map = new Map({ key, containerElement })
    const mapElement = document.createElement('div')
    map.loadMap(mapElement, options)

    expect(global.google.maps.Map).toHaveBeenCalledTimes(1)
    expect(global.google.maps.Map.mock.instances.length).toBe(1)
    expect(global.google.maps.Map).toHaveBeenLastCalledWith(mapElement, {
      ...defaultOptions,
      ...options
    })
  })

  it('Google Maps callback should invoke loadMap() and destroy itself', () => {
    const containerElement = document.createElement('div')
    const map = new Map({ key, options, containerElement }) // eslint-disable-line no-unused-vars
    const spy = jest.spyOn(map, 'loadMap')

    expect(window[callback]).toBeDefined()
    window[callback]()
    expect(window[callback]).not.toBeDefined()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(map.getMapContainer(), options)
  })

  it('setRoutePoints() should set route points and max distance', () => {
    const containerElement = document.createElement('div')
    const map = new Map({ key, containerElement })
    const maxDistance = Math.max(
      ...routePoints.map(point => point.DistanceMeters)
    )
    map.setRoutePoints(routePoints)

    expect(map.getRoutePoints()).toEqual(routePoints)
    expect(map.maxDistance).toEqual(maxDistance)
  })

  it('updatePolygons() should update polygons', () => {
    const setPathMock = jest.fn()
    global.google.maps.Polyline = jest.fn().mockImplementation(() => {
      return {
        setPath: setPathMock
      }
    })
    const containerElement = document.createElement('div')
    const map = new Map({ key, containerElement })
    map.initPolygons()
    map.setRoutePoints(routePoints)
    map.updatePolygons(0.01, 0.01, 0.01, 0.01)

    expect(setPathMock).toBeCalledTimes(4)
    expect(setPathMock.mock.calls).toMatchSnapshot()
  })
})

/* eslint-enable no-global-assign */
