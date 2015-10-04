(function() {

  console.log('hi')

  // set up an fps counter
  var countFrame = (function() {
    var frameStartTime = performance.now()
    var frameCount = 0

    function logFps() {
      var now = performance.now()
      var diffMs = now - frameStartTime
      var diffSecs = diffMs / 1000
      console.log('fps: ' + frameCount / diffSecs)

      frameStartTime = now
      frameCount = 0
    }

    function countFrame() {
      frameCount++
    }

    setInterval(logFps, 5*1000)
    
    return countFrame
  })()
  
  // define main game loop
  function loop() {
    countFrame()
    
    window.requestAnimationFrame(loop)
  }

  // start the game running
  loop()

})()
