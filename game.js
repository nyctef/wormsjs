var game = (function() {

  var canvas = document.getElementById('screen')
  var canvasParent = canvas.parentNode
  canvas.width = canvasParent.offsetWidth
  canvas.height = canvasParent.offsetHeight
  var screen = canvas.getContext('2d')

  var game = {}

  game.size = { x: canvas.width, y: canvas.height }

  console.log(game.size)

  // set up an fps counter
  var countFrame = (function() {
    var lastFrameStartTime = performance.now()
    var frameCountStartTime = performance.now()
    var frameCount = 0

    function logFps() {
      var now = performance.now()
      var diffMs = now - frameCountStartTime
      var diffSecs = diffMs / 1000
      console.log('fps: ' + frameCount / diffSecs)

      frameCountStartTime = now
      frameCount = 0
    }

    function countFrame() {
      var thisFrameStartTime = performance.now()
      var tdelta = thisFrameStartTime - lastFrameStartTime
      lastFrameStartTime = thisFrameStartTime
      frameCount++
      return tdelta
    }

    setInterval(logFps, 5*1000)
    
    return countFrame
  })()

  var Keyboarder = function() {
    // based on https://vimeo.com/105955605
    var keyState = {}

    window.onkeydown = function(e) {
      keyState[e.keyCode] = true
    }

    window.onkeyup = function(e) {
      keyState[e.keyCode] = false
    }

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true
    }

    this.Keys = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
    }
  }

  var Player = function() {
    this.keyboarder = new Keyboarder(),
    this.position = { x: 50, y: 50 }
    this.draw = function(screen) {
      drawCircle(screen, this.position.x, this.position.y, 5, 'green')
    }
    this.update = function() {
      var newX
      if (this.keyboarder.isDown(this.keyboarder.Keys.LEFT)) {
        newX = this.position.x - 2
      } else if (this.keyboarder.isDown(this.keyboarder.Keys.RIGHT)) {
        newX = this.position.x + 2
      } else {
        return
      }
      if (!(game.edgePixelData)) {
        return
      }
      var alpha = game.edgePixelData.data[(this.position.y * 4 * game.size.x) + (newX * 4) + 3]
      if (alpha <= 0) {
        this.position.x = newX
      }
    }
  }

  var player = new Player()

  game.options = {
    drawEdgePixelData: false
  }

  function getEdgePixelData() {
    var R = 0
    var G = 1
    var B = 2
    var A = 3
    var imageDataResult = screen.getImageData(0, 0, game.size.x, game.size.y)
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

  function drawCircle(screen, centerX, centerY, radius, fillStyle) {
    fillStyle = fillStyle || 'green'
    screen.beginPath()
    screen.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    screen.fillStyle = fillStyle
    screen.fill()
  }

  function eraseCircle(screen, centerX, centerY, radius) {
    var oldCompositeOperation = screen.globalCompositeOperation
    try {
      screen.globalCompositeOperation = 'destination-out'
      drawCircle(screen, centerX, centerY, radius, 'rgba(0,0,0,1)')
    } finally {
      screen.globalCompositeOperation = oldCompositeOperation
    }
  }

  function drawUpdate() {
    screen.fillStyle = 'black'
    screen.fillRect(5, 5, 100, 100)
    eraseCircle(screen, 50, 50, 25)
    game.edgePixelData = getEdgePixelData()
  }

  function draw() {
    drawUpdate()

    if (game.options.drawEdgePixelData) {
      screen.putImageData(game.edgePixelData, 0, 0)
    }

    player.draw(screen)
  }

  // define main game loop
  game.loop = function() {
    tdelta = countFrame()

    update()
    draw()
    
    window.requestAnimationFrame(game.loop)
  }

  // start the game running
  game.loop()

  return game

})()
