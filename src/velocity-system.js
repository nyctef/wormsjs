import log from 'loglevel'
import PlayerStateComponent from './playerstate-component'

function sign(x) {
  if (x < 0) return -1
  if (x == 0) return 0
  return 1
}

var VelocitySystem = function() {
  this.log = log.getLogger('VelocitySystem')
  this.log.setLevel('debug')
  log.setLevel('debug')
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

  function getCollisionPredicate(game, entity) {
    return (x0, y0) => {
      var size = entity.size
      var shape = entity.shape
      for (var x=0; x<size.width; x++) {
        for (var y=0; y<size.height; y++) {
          if (shape[y*size.width + x] &&
              game.map.mapDataAt(x0 + x, y0 + y).isEdge) {
            log.debug(`found a collision between position ${x},${y} in shape with point ${x0 + x},${y0 + y} in map`)
            return true
          }
        }
      }
    }
  }

  this.check_collisions = function(game, entity) {
    if (entity.move_plan.x != 0) { 
      // todo: this assumes move_plan.x is 1 at most
      if (entity.move_plan.x > 1) { this.log.warn("don't know how to deal with a moveplan >1 px"); }
      // todo: this position -2 can put us over the top of the map (which is an edge by default) even if the 
      // entity's position isn't touching the edge yet
      var maxClimbY = entity.position.y - 2
      this.log.debug(`checking for a wall in front of us (position ${entity.position.x},${entity.position.y}) ` +
                     `from ${entity.position.x + entity.move_plan.x},${maxClimbY} ` +
                     `to   ${entity.position.x + entity.move_plan.x},${entity.position.y}`)
      var wallAhead = game.map.castLine(
        getCollisionPredicate(game, entity),
        entity.position.x + entity.move_plan.x, maxClimbY,
        entity.position.x + entity.move_plan.x, entity.position.y)
      if (wallAhead) {
        this.log.debug(`checking slope ahead of entity: ${wallAhead.y} vs ${maxClimbY}`)
        if (wallAhead.y != maxClimbY) {
          this.log.debug(`climbing with move_plan.y = ${entity.move_plan.y}`)
          entity.move_plan.y = wallAhead.y - entity.position.y - 1
          this.log.debug(`..set move_plan.y to ${entity.move_plan.y} (=${wallAhead.y} - ${entity.position.y} - 1)`)
        }
        else {
          this.log.debug('collision with wall')
          // a collision happened
          entity.velocity.x = 0
          entity.move_plan.x = 0
        }
      }
    }

    var x0 = entity.position.x, x1 = entity.position.x;
    var y0 = entity.position.y, y1 = entity.position.y + 2;
    this.log.debug(`checking for an edge below us (position ${entity.position.x},${entity.position.y}) from ${x0},${y0} to ${x1},${y1}`)
      var edgeBelow = game.map.castLine(
        getCollisionPredicate(game, entity),
        x0, y0, x1, y1);
    if (edgeBelow) {
      this.log.debug(`edgeBelow found at ${edgeBelow.x},${edgeBelow.y}`)
    }
    if (entity.move_plan.y > 0) { // TODO: should this check for FALLING instead? are those equivalent?
      // check for an edge up to two pixels below us
      if (edgeBelow) {
        this.log.debug(`collision with ground at ${edgeBelow.x},${edgeBelow.y}: setting position to ${edgeBelow.x},${edgeBelow.y-1}, vy to 0 and mpy to 0`)
        entity.position.x = edgeBelow.x
        entity.position.y = edgeBelow.y-1
        entity.velocity.y = 0
        entity.move_plan.y = 0
        entity.player_state.state = PlayerStateComponent.STANDING
      }
    } 

    if (!edgeBelow) {
      this.log.debug('starting to fall')
      entity.player_state.state = PlayerStateComponent.FALLING
      entity.velocity.y = 60
    }
  }

  this.apply_move_plan = function(game, entity) {
    entity.position.x += entity.move_plan.x
    entity.position.y += entity.move_plan.y
  }

}

export default VelocitySystem
