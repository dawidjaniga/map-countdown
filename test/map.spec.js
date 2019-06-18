/* global document, jest, describe, it, expect, afterEach */
import cloneDeep from 'lodash/cloneDeep'
import createGoogleMapsMock from 'jest-google-maps-mock'
import Map from '../src/Map'

const originalDocument = cloneDeep(document)

/* eslint-disable no-global-assign */
describe('Map', () => {
  const key = 'google-generated-api-key'
  const callback = '__MapCountdownLoadMap'
  const libraries = ['drawing']
  const mapId = 'map'
  const selector = `#${mapId}`
  const options = {
    center: {
      lat: 40.7484405,
      lng: -73.9944191
    },
    zoom: 12
  }
  global.window.google = {}
  global.window.google.maps = createGoogleMapsMock()

  afterEach(() => {
    restoreDocument()
  })

  it('should append Google Maps script to body', () => {
    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callback}&libraries=${libraries}`
    const map = new Map({ key, callback, libraries }) // eslint-disable-line no-unused-vars

    expect(document.scripts).toContainEqual(expect.objectContaining({ src }))
  })

  it('loadMap() should load Google Map into container', () => {
    const map = new Map({ key })
    const mapElement = document.createElement('div')
    mapElement.setAttribute('id', mapId)
    document.body.appendChild(mapElement)

    map.loadMap(selector, options)

    expect(global.window.google.maps.Map).toHaveBeenCalledTimes(1)
    expect(global.window.google.maps.Map.mock.instances.length).toBe(1)
    expect(global.window.google.maps.Map).toHaveBeenLastCalledWith(
      mapElement,
      options
    )
  })

  it('Google Maps should invoke callback', () => {
    const map = new Map({ key, selector, options }) // eslint-disable-line no-unused-vars
    const spy = jest.spyOn(map, 'loadMap')
    window[callback]()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(selector, options)
  })
})

function restoreDocument () {
  document = cloneDeep(originalDocument)
}
/* eslint-enable no-global-assign */
