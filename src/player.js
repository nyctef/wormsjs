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

}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
//
export default Player
