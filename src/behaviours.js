import Keyboard from './keyboard'
import * as c from './behaviours'

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

var MovePlanComponent = function(x, y) {
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
  this.set_move_plan = function(game, entity) {
    if (!entity.position || !entity.velocity) { return }
    var dx = entity.velocity.x
    var dy = entity.velocity.y
    var sx = sign(dx)
    var sy = sign(dy)
    if (this.frame_counter % (60 / dx) == 0) { entity.move_plan.x = sx } else { entity.move_plan.x = 0 }
    if (this.frame_counter % (60 / dy) == 0) { entity.move_plan.y = sy } else { entity.move_plan.y = 0 }
  }

  this.check_collisions = function(game, entity) {
    if (entity.move_plan.x != 0) { 
      // todo: this assumes move_plan.x is 1 at most
      var maxClimbY = entity.position.y - 2
      var wallAhead = game.castLine(entity.position.x + entity.move_plan.x, maxClimbY,
                                    entity.position.x + entity.move_plan.x, entity.position.y)
      if (wallAhead) {
        if (wallAhead.y != maxClimbY) {
          console.log(`climbing with move_plan.y = ${entity.move_plan.y}`)
          entity.move_plan.y = wallAhead.y - entity.position.y - 1
          console.log(`..set move_plan.y to ${entity.move_plan.y} (=${wallAhead.y} - ${entity.position.y} - 1)`)
        }
        else {
          console.log('collision with wall')
          // a collision happened
          entity.velocity.x = 0
          entity.move_plan.x = 0
        }
      }
    }

    if (entity.move_plan.y > 0) { // TODO: should this check for FALLING instead? are those equivalent?
      // check for an edge up to two pixels below us
      var edgeBelow = game.castLine(entity.position.x, entity.position.y+1,
                                    entity.position.x, entity.position.y+2)
      if (edgeBelow) {
        console.log('collision with ground')
        entity.position.x = edgeBelow.x
        entity.position.y = edgeBelow.y-1
        entity.velocity.y = 0
        entity.move_plan.y = 0
        entity.player_state.state = c.PlayerStateComponent.STANDING
      }
    } 
    
    if (!game.mapDataAt(entity.position.x, entity.position.y+1).isEdge) {
      entity.player_state.state = c.PlayerStateComponent.FALLING
      entity.velocity.y = 60
    }
  }

  this.apply_move_plan = function(game, entity) {
    entity.position.x += entity.move_plan.x
    entity.position.y += entity.move_plan.y
  }

}

var PlayerStateComponent = function() {
  PlayerStateComponent.FALLING = 0
  PlayerStateComponent.STANDING = 1
  PlayerStateComponent.WALKING = 2

  this.state = PlayerStateComponent.FALLING
  // TODO: also need to store state data in here?
}

export {
  KeyboardInputComponent, KeyboardInputSystem,
  VelocityComponent, VelocitySystem,
  PositionComponent,
  MovePlanComponent,
  PlayerStateComponent,
}
