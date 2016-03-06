import * as c from './behaviours'

var Player = function() {
  this.keyboard_input = new c.KeyboardInputComponent()
  this.position = new c.PositionComponent(60, 50)
  this.velocity = new c.VelocityComponent(0, 0)
  this.move_plan = new c.MovePlanComponent(0, 0)
  this.player_state = new c.PlayerStateComponent()
  this.draw = function(screen) {
    screen.drawRect(this.position.x, this.position.y, 1, 1, 'green')
  }
  this.update = function() {
    if (this.player_state.state == c.PlayerStateComponent.STANDING) {
      this.standing()
    } else if (this.player_state.state == c.PlayerStateComponent.WALKING) {
      this.walking()
    }
  }

  this.standing = function() {

    if (this.keyboard_input.left || this.keyboard_input.right) {
      this.player_state.state = c.PlayerStateComponent.WALKING
      return
    }
  }

  this.walking = function () {

    // start moving left or right if the keyboard buttons are held
    var sx
    if (this.keyboard_input.left) {
      sx = -1
    } else if (this.keyboard_input.right) {
      sx = +1
    } else {
      this.velocity.x = 0
      this.player_state.state = c.PlayerStateComponent.STANDING
      return
    }

      this.velocity.x = sx * 10
  }
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
//
export default Player
