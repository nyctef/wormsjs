"use strict";
var game = (function() {

  var canvas = document.getElementById('screen')
  var canvasParent = canvas.parentNode
  canvas.width = canvasParent.offsetWidth
  canvas.height = canvasParent.offsetHeight
  var screen = new Screen(canvas)

  var game = {}

  game.size = { x: canvas.width, y: canvas.height }

  console.log(game.size)

  drawUpdate()

  game.map = screen.getImageData()
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
      if (imageData[i+A] == 0) continue

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

  function update() {
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
      }
    }
  }

  function draw() {
    getEdgePixelData(game.map, game.mapData)
    // copy map to mapRender
    game.mapRender.data.set(game.map.data)

    if (game.options.drawEdgePixelData) {
      drawIsEdge(game.mapData, game.mapRender)
    }

    screen.putImageData(game.mapRender)
    player.draw(screen)
  }

  // define main game loop
  game.loop = function() {
    var tdelta = countFrame()

    update()
    draw()
    
    window.requestAnimationFrame(game.loop)
  }

  // start the game running
  game.loop()

  return game

})()
