var KeyboardInputComponent = function() {
  this.left = false
  this.right = false
  this.jump = false
  this.fire = false
}

var KeyboardInputSystem = function() {
  this.keyboard = new Keyboard()
  this.update = function(game, entity) {
    if (!entity.keyboard_input) { return }
    
    var left = this.keyboard.isDown(this.keyboard.Keys.LEFT)
    var right = this.keyboard.isDown(this.keyboard.Keys.RIGHT)
    var space = this.keyboard.isDown(this.keyboard.Keys.SPACE)

    if (left && right) { left = right = false }

    entity.keyboard_input.left = left
    entity.keyboard_input.right = right
    entity.keyboard_input.jump = space
  }
}

