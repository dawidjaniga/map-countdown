/* global google */

export default class Map {
  constructor ({ key, selector, options }) {
    this.key = key
    this.callback = '__MapCountdownLoadMap'
    this.libraries = ['drawing']

    window[this.callback] = () => {
      this.loadMap(selector, options)
    }

    this.appendMapScriptToDocument()
  }
  updatePolygon (name, value) {
    // console.log('name:', name)
  }

  appendMapScriptToDocument () {
    document.body.appendChild(this.createMapScript())
  }

  createMapScript () {
    const script = document.createElement('script')
    script.setAttribute(
      'src',
      `https://maps.googleapis.com/maps/api/js?key=${this.key}&callback=${
        this.callback
      }&libraries=${this.libraries}`
    )
    script.setAttribute('defer', true)
    script.setAttribute('async', true)

    return script
  }

  loadMap (mapContainerSelector, mapOptions) {
    try {
      this.map = new google.maps.Map(
        document.querySelector(mapContainerSelector),
        mapOptions
      )
    } catch (e) {
      console.log('e:', e)
    }
  }
}
