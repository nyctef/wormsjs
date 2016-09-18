var Keyboard = function() {
  // based on https://vimeo.com/105955605
  var keyState = {}

  window.onkeydown = function(e) {
    keyState[e.keyCode] = true
    return false;
  }

  window.onkeyup = function(e) {
    keyState[e.keyCode] = false
    return false;
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

export default Keyboard
