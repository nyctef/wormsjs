import * as c from './behaviours'

var Player = function(game) {
  this.game = game
  this.keyboard_input = new c.KeyboardInputComponent()
  this.position = new c.PositionComponent(60, 50)
  this.velocity = new c.VelocityComponent(0, 0)
  this.move_plan = new c.MovePlanComponent(0, 0)
  this.draw = function(screen) {
    screen.drawRect(this.position.x, this.position.y, 1, 1, 'green')
  }
  this.update = function() {
    this.state()
  }
  this.canFall = function() {
    // if there is no solid ground beneath us then start falling
    return !this.game.mapDataAt(this.position.x, this.position.y+1).isEdge
  }

  this.falling = function() {
    // check for an edge up to two pixels below us
    var edgeBelow = this.game.castLine(this.position.x, this.position.y+1,
                                       this.position.x, this.position.y+2)
    if (edgeBelow) {
      this.position.x = edgeBelow.x
      this.position.y = edgeBelow.y-1
      this.velocity.x = this.velocity.y = 0
      this.state = this.standing
    }
    else {
      this.velocity.y = 60
    }
  }

  this.standing = function() {
    if (this.canFall()) {
      this.state = this.falling
      return
    }

    if (this.keyboard_input.left || this.keyboard_input.right) {
      this.state = this.walking
      return
    }
  }

  this.walking = function () {
    if (this.canFall()) {
      this.state = this.falling
      return
    }

    // start moving left or right if the keyboard buttons are held
    var sx
    if (this.keyboard_input.left) {
      sx = -1
    } else if (this.keyboard_input.right) {
      sx = +1
    } else {
      this.velocity.x = 0
      this.state = this.standing
      return
    }

      this.velocity.x = sx * 10
  }

  this.state = this.falling
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
//
export default Player
