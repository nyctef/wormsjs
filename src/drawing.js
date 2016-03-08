function DrawingSystem() {
  this.draw = function(screen, entity) {
    var appearance = entity.appearance
    if (appearance.type == 'rectangle') {
      var rect = appearance.data
      screen.drawRect(entity.position.x, entity.position.y,
                      rect.height, rect.width, rect.color)
    } else if (appearance.type == 'shape') {
      var size = appearance.data.size
      var shape = appearance.data.shape
      var color = appearance.data.color
      for (var x=0; x<size.width; x++) {
        for (var y=0; y<size.height; y++) {
          if (shape[y*size.width + x]) {
            screen.drawPixel(entity.position.x + x,
                             entity.position.y + y,
                             color)
          }
        }
      }
    } else {
      throw 'appearance not handled: ' + appearance.type
    }
  }

  this.drawDebugData = function(screen, game) {
    if (game.options.drawEdgePixelData) {
      this.drawIsEdge(screen, game.map.getMapData())
    }
  }

  this.drawIsEdge = function(screen, mapData) {
    var width = screen.width
    for (var i=0; i< mapData.length; i++) {
      if (mapData[i].isEdge) {
        screen.drawPixel(i%width, Math.round(i/width), 'red')
      }
    }
  }

  function setPixel(target, x, y, r, g, b, a) {
      target.data[(y*target.width*4)+x*4] = r
      target.data[(y*target.width*4)+x*4+1] = g
      target.data[(y*target.width*4)+x*4+2] = b
      target.data[(y*target.width*4)+x*4+3] = a
  }

  function drawLine(target, x0, y0, x1, y1) {
    // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    // http://stackoverflow.com/a/4672319/895407
    var dx = Math.abs(x1-x0)
    var dy = Math.abs(y1-y0)
    var sx = (x0 < x1) ? 1 : -1
    var sy = (y0 < y1) ? 1 : -1
    var err = dx-dy

    while(true) {
      setPixel(target, x0, y0, 255, 0, 0, 255)

      if ((x0==x1) && (y0==y1)) break
      var e2 = 2*err
      if (e2 >-dy){ err -= dy; x0  += sx }
      if (e2 < dx){ err += dx; y0  += sy }
    }
  }

}

function AppearanceComponent(type, data) {
  this.type = type
  this.data = data
}

export { 
  DrawingSystem, AppearanceComponent
}
