export class Keyboard {
  _keyState: { [keycode: number]: boolean } = {};
  // based on https://vimeo.com/105955605
  constructor(window: Window) {
    this._keyState = {};
    const self = this;
    window.onkeydown = function(e) {
      self._keyState[e.keyCode] = true;
      return false;
    };

    window.onkeyup = function(e) {
      self._keyState[e.keyCode] = false;
      return false;
    };
  }

  isDown = (keyCode: number) => {
    return this._keyState[keyCode] === true;
  };

  static Keys = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
  };
}
