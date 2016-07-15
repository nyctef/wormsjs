import log from 'loglevel'

function PixelData() {
  this.isEdge = false
}

var edge = new PixelData()
edge.isEdge = true

  var R = 0
  var G = 1
  var B = 2
  var A = 3

function getEdgePixelData(mapInput, mapData) {

  var gameWidth = mapInput.width
  var gameHeight = mapInput.height
  var imageData = mapInput.data
  var pixelWidth = gameWidth * 4
  var pixelHeight = pixelWidth * gameHeight
  for (var i=0; i<imageData.length; i+= 4) {
    if (imageData[i+A] == 0) { mapData[i/4].isEdge = false; continue }

    if ((i > pixelWidth && imageData[i-pixelWidth+A] == 0) ||
        ((i % pixelWidth) > 0 && imageData[i-4+A] == 0) ||
          ((i % pixelWidth) < pixelWidth - 1 && imageData[i+4+A] == 0) ||
            (i < pixelHeight - pixelWidth && imageData[i+pixelWidth+A] == 0)) {
      mapData[i/4].isEdge = true
    }
    else {
      mapData[i/4].isEdge = false
    }
  }
}

function Map(initialImageData) {
  this._imageData = initialImageData
  this._w = initialImageData.width
  this._h = initialImageData.height

  this.log = log.getLogger('Map')
  this.log.setLevel('debug')

  this._mapData = new Array(this._w*this._h)
  for (var i=0; i<this._w*this._h; i++) { 
    this._mapData[i] = new PixelData()
  }

  getEdgePixelData(this._imageData, this._mapData)
  
  // drawing-related functions

  this.getImageData = function() {
    return this._imageData
  }
  
  this.getMapData = function() {
    return this._mapData
  }

  // collision-related functions

  this.mapDataAt = function (x, y) {
    if (x<0 || x>=this._w ||
        y<0 || y>=this._h) { return edge }
    return this._mapData[(y*this._w) + x]
  }

  this.explodeHole = function(x0, y0, radius) {
    for (var y = y0 - radius; y < y0 + radius; y++) {
      for (var x = x0 - radius; x < x0 + radius; x++) {
        var xw = (x0-x)*(x0-x)
        var yw = (y0-y)*(y0-y)
        if (xw + yw <= radius*radius) {
          this._imageData.data[y*4*this._w + x*4 + A] = 0
        }
      }
    }
    // TODO: can restrict this to just the area that we've changed
    getEdgePixelData(this._imageData, this._mapData)
  }
}

export default Map
