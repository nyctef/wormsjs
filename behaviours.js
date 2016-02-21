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

var PositionComponent = function(x, y) {
  this.x = x || 0
  this.y = y || 0
}

// measured in pixels per second (eg 60 would be one pixel per frame)
var VelocityComponent = function(dx, dy) {
  this.dx = dx || 0
  this.dy = dy || 0
}

function sign(x) {
  if (x < 0) return -1
  if (x == 0) return 0
  return 1
}

var VelocitySystem = function() {
  this.frame_counter = 0
  this.start_frame = function(game) {
    this.frame_counter++
  }

    // vel 1 => vel +1 when fc % 60 == 0
    // vel 2 => vel +1 when fc % 30 == 0
    // vel 3 => vel +1 when fc % 20 == 0
    // vel 60 => vel +1 when fc % 1 == 0
    // TODO:
    // vel 120 => vel +2 when fc % 1 == 0
    // vel 90 => vel +1 when fc % 2 == 0 and vel +2 when fc % 2 == 1
    // will other systems start breaking if we move more than one pixel/frame?
  this.update = function(game, entity) {
    if (!entity.position || !entity.velocity) { return }
    var dx = entity.velocity.x
    var dy = entity.velocity.y
    var sx = sign(dx)
    var sy = sign(dy)
    if (this.frame_counter % (60 / dx) == 0) { entity.position.x += sx }
    if (this.frame_counter % (60 / dy) == 0) { entity.position.y += sy }
  }
}
