(function() {

  console.log('hi')

  var canvas = document.getElementById('screen')
  var screen = canvas.getContext('2d')
  var gameSize = { x: canvas.width, y: canvas.height }

  console.log(gameSize)

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

  var edgePixelData
  
  function getEdgePixelData() {
    var R = 0
    var G = 1
    var B = 2
    var A = 3
    var imageDataResult = screen.getImageData(0, 0, gameSize.x, gameSize.y)
    var imageData = imageDataResult.data
    var pixelWidth = gameSize.x * 4
    var pixelHeight = pixelWidth * gameSize.y
    for (var i=0; i<imageData.length; i+= 4) {
      if (imageData[i+A] == 0) continue

      if (i > pixelWidth &&
          imageData[i-pixelWidth+A] == 0) {
        imageData[i+R] = 255
      } else if ((i % pixelWidth) > 0 &&
                 imageData[i-4+A] == 0) {
        imageData[i+R] = 255
      } else if ((i % pixelWidth) < pixelWidth - 1 &&
                 imageData[i+4+A] == 0) {
        imageData[i+R] = 255
      } else if (i < pixelHeight - pixelWidth &&
                 imageData[i+pixelWidth+A] == 0) {
        imageData[i+R] = 255
      }

    }

    edgePixelData = imageDataResult
  }

  function update() {
  }

  function draw() {
    screen.fillRect(5, 5, 100, 100)
    getEdgePixelData()
    screen.putImageData(edgePixelData, 0, 0)
  }

  // define main game loop
  function loop() {
    tdelta = countFrame()

    update()
    draw()
    
    window.requestAnimationFrame(loop)
  }

  // start the game running
  loop()

})()
