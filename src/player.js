import * as c from './behaviours'
import * as d from './drawing'

var Player = function() {
  this.keyboard_input = new c.KeyboardInputComponent()
  this.position = new c.PositionComponent(60, 50)
  this.velocity = new c.VelocityComponent(0, 0)
  this.move_plan = new c.MovePlanComponent(0, 0)
  this.player_state = new c.PlayerStateComponent()
  this.size = { width: 5, height: 7 }
  this.shape = [
    0,0,1,0,0,
    0,1,1,1,0,
    1,1,1,1,1,
    1,1,1,1,1,
    1,1,1,1,1,
    0,1,1,1,0,
    0,0,1,0,0,
  ]
  this.appearance = new d.AppearanceComponent('shape', {
    size: this.size,
    shape: this.shape,
    color: 'green'
  })

}

export default Player
