"use strict";
var game = (function() {

  var canvas = document.getElementById('screen')
  var canvasParent = canvas.parentNode
//  canvas.width = canvasParent.offsetWidth
//  canvas.height = canvasParent.offsetHeight
  var screen = new Screen(canvas)

  var game = {}

  game.size = { x: canvas.width, y: canvas.height }

  console.log(game.size)

  drawUpdate()

  function updateMap() {
    game.map = screen.getImageData()
  }
  updateMap()
  game.mapRender = screen.createImageData()

  var player = new Player(game)

  game.options = {
    drawEdgePixelData: true
  }

  function PixelData() {
    this.isEdge = false
  }
  game.mapData = new Array(game.size.x*game.size.y)
  for (var i=0; i<game.size.x*game.size.y; i++) { game.mapData[i] = new PixelData(); }

  function getEdgePixelData(mapInput, mapData) {
    var R = 0
    var G = 1
    var B = 2
    var A = 3

    var imageData = mapInput.data
    var pixelWidth = game.size.x * 4
    var pixelHeight = pixelWidth * game.size.y
    for (var i=0; i<imageData.length; i+= 4) {
      if (imageData[i+A] == 0) { mapData[i/4].isEdge = false; continue; }

      if ((i > pixelWidth && imageData[i-pixelWidth+A] == 0) ||
         ((i % pixelWidth) > 0 && imageData[i-4+A] == 0) ||
         ((i % pixelWidth) < pixelWidth - 1 && imageData[i+4+A] == 0) ||
         (i < pixelHeight - pixelWidth && imageData[i+pixelWidth+A] == 0)) {
        mapData[i/4].isEdge = true;
      }
      else {
        mapData[i/4].isEdge = false;
      }
    }
  }

  var keyboardInputSystem = new KeyboardInputSystem()

  function update() {
    keyboardInputSystem.update(game, player)
    player.update()
  }


  function drawUpdate() {
    screen.drawRect(5, 5, 100, 100, 'black')
    screen.eraseCircle(50, 50, 25)
  }

  function drawIsEdge(mapData, mapRender) {
    for (var i=0; i< mapData.length; i++) {
      if (mapData[i].isEdge) {
        mapRender.data[(i*4)+0] = 255
        mapRender.data[(i*4)+3] = 255
      }
    }
  }

  function setPixel(target, x, y, r, g, b, a) {
      target.data[(y*target.width*4)+x*4] = r;
      target.data[(y*target.width*4)+x*4+1] = g;
      target.data[(y*target.width*4)+x*4+2] = b;
      target.data[(y*target.width*4)+x*4+3] = a;
  }

  function drawLine(target, x0, y0, x1, y1) {
    // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    // http://stackoverflow.com/a/4672319/895407
    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;

    while(true) {
      setPixel(target, x0, y0, 255, 0, 0, 255)

      if ((x0==x1) && (y0==y1)) break;
      var e2 = 2*err;
      if (e2 >-dy){ err -= dy; x0  += sx; }
      if (e2 < dx){ err += dx; y0  += sy; }
    }
  }

  function Point(x, y) {
    this.x = x
    this.y = y
  }

  function castLine(isEdge, x0, y0, x1, y1) {
    // based on drawLine/Bresenham's - iterate along the line and stop if we see an edge
    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;

    while(true) {
      if (isEdge(x0, y0)) { return new Point(x0, y0) }

      if ((x0==x1) && (y0==y1)) { return null }
      var e2 = 2*err;
      if (e2 >-dy){ err -= dy; x0  += sx; }
      if (e2 < dx){ err += dx; y0  += sy; }
    }
  }

  var edge = new PixelData()
  edge.isEdge = true;
  
  game.mapDataAt = function mapDataAt(x, y) {
    if (x<0 || x>=game.size.x ||
        y<0 || y>=game.size.y) { return edge }
    return game.mapData[(y*game.size.x) + x]
  }

  game.castLine = function(x0, y0, x1, y1) {
    var isEdge = function(x, y) { 
      return game.mapDataAt(x, y).isEdge 
    }
    return castLine(isEdge, x0, y0, x1, y1);
  }

  function draw() {
    getEdgePixelData(game.map, game.mapData)
    // copy map to mapRender
    game.mapRender.data.set(game.map.data)

    if (game.options.drawEdgePixelData) {
      drawIsEdge(game.mapData, game.mapRender)
    }

    drawLine(game.mapRender, 110, 5, 200, 5)
    drawLine(game.mapRender, 115, 10, 200, 70)
    drawLine(game.mapRender, 110, 15, 200, 100)

    screen.putImageData(game.mapRender)
    player.draw(screen)
  }

  // define main game loop
  game.loop = function() {
    var tdelta = countFrame()

    update()
    draw()
    
    window.requestAnimationFrame(game.loop)
    //window.setTimeout(game.loop, 0)
  }

  canvas.addEventListener('click', function(clickEvent) {
    console.log(clickEvent)
    var x = clickEvent.pageX - canvas.offsetLeft
    var y = clickEvent.pageY - canvas.offsetTop
    var mx = Math.round(x * canvas.width / canvas.offsetWidth)
    var my = Math.round(y * canvas.height / canvas.offsetHeight)
    console.log(`registered click at ${x},${y} (${mx},${my})`)
    screen.eraseCircle(mx, my, 10)
    updateMap()
  })

  // start the game running
  game.loop()


  return game

})()
