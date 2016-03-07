import * as c from './behaviours'
import * as d from './drawing'

var Player = function() {
  this.keyboard_input = new c.KeyboardInputComponent()
  this.position = new c.PositionComponent(60, 50)
  this.velocity = new c.VelocityComponent(0, 0)
  this.move_plan = new c.MovePlanComponent(0, 0)
  this.player_state = new c.PlayerStateComponent()
  this.appearance = new d.AppearanceComponent('rectangle', {
    width: 1,
    height: 1,
    color: 'green'
  })

}

export default Player
