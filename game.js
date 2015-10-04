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

  var player = new Player(game)

  game.options = {
    drawEdgePixelData: false
  }

  function getEdgePixelData() {
    var R = 0
    var G = 1
    var B = 2
    var A = 3
    var imageDataResult = screen.getImageData()
    var imageData = imageDataResult.data
    var pixelWidth = game.size.x * 4
    var pixelHeight = pixelWidth * game.size.y
    for (var i=0; i<imageData.length; i+= 4) {
      if (imageData[i+A] == 0) continue

      if ((i > pixelWidth && imageData[i-pixelWidth+A] == 0) ||
         ((i % pixelWidth) > 0 && imageData[i-4+A] == 0) ||
         ((i % pixelWidth) < pixelWidth - 1 && imageData[i+4+A] == 0) ||
         (i < pixelHeight - pixelWidth && imageData[i+pixelWidth+A] == 0)) {
        imageData[i+R] = 255
        // fix up the fact that canvas arc drawing does antialiasing
        // (AFAIK there's no way to turn it off unless we write our own
        // drawCircle functions)
        imageData[i+A] = 255
      }
    }

    return imageDataResult
  }

  function update() {
    player.update()
  }


  function drawUpdate() {
    screen.drawRect(5, 5, 100, 100, 'black')
    screen.eraseCircle(50, 50, 25)
    game.edgePixelData = getEdgePixelData()
  }

  function draw() {
    drawUpdate()

    if (game.options.drawEdgePixelData) {
      screen.putImageData(game.edgePixelData)
    }

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
