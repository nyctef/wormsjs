var Keyboard = function() {
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
