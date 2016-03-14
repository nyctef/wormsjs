var Keyboard = function() {
  // based on https://vimeo.com/105955605
  // TODO: make this work cross-browser (and just expose Keys / isDown as the API)
  var _keyState = {}
  var _keyUpHandlers = []

  window.addEventListener('keydown', function(e) {
    _keyState[e.keyCode] = true
  })

  window.addEventListener('keyup', function(e) {
    _keyState[e.keyCode] = false
    _keyUpHandlers.forEach(x => { x(e.keyCode) })
  })

  this.isDown = function(keyCode) {
    return _keyState[keyCode] === true
  }

  Keyboard.Keys = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    P: 80,
  }

  this.addKeyUpHandler = function(func) {
    _keyUpHandlers.push(func)
  }
}

export default Keyboard
