import log from 'loglevel'
import PlayerStateComponent from './playerstate-component'
import { castLine } from './math'

function sign(x) {
  if (x < 0) return -1
  if (x == 0) return 0
  return 1
}

var VelocitySystem = function() {
  this.log = log.getLogger('VelocitySystem')
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
    if (!entity.move_plan || !entity.velocity) { return }
    var dx = entity.velocity.x
    var dy = entity.velocity.y
    var sx = sign(dx)
    var sy = sign(dy)
    if (this.frame_counter % (60 / dx) == 0) { entity.move_plan.x = sx } else { entity.move_plan.x = 0 }
    if (this.frame_counter % (60 / dy) == 0) { entity.move_plan.y = sy } else { entity.move_plan.y = 0 }
  }

  var noop = () => {}

  function getCollisionPredicate(map, entity, doLog=noop) {
    return (x0, y0) => {
      var size = entity.size
      var shape = entity.shape
      for (var x=0; x<size.width; x++) {
        for (var y=0; y<size.height; y++) {
          if (shape[y*size.width + x] &&
              map.mapDataAt(x0 + x, y0 + y).isEdge) {
            doLog(`found a collision between position ${x},${y} in shape with point ${x0 + x},${y0 + y} in map`)
            return true
          }
        }
      }
    }
  }

  this.check_collisions = function(map, entity) {
    var pos = entity.position
    var mp = entity.move_plan
    var ps = entity.player_state
    var v = entity.velocity

    if (mp.x != 0) { 
      // todo: this assumes move_plan.x is 1 at most
      if (mp.x > 1) { this.log.warn("don't know how to deal with a moveplan >1 px") }
      // todo: this position -2 can put us over the top of the map (which is an edge by default) even if the 
      // entity's position isn't touching the edge yet
      var maxClimbY = pos.y - 2
      this.log.debug(`checking for a wall in front of us (position ${pos.x},${pos.y}) ` +
                     `from ${pos.x + mp.x},${maxClimbY} ` +
                     `to   ${pos.x + mp.x},${pos.y}`)
      var wallAhead = castLine(
        getCollisionPredicate(map, entity, this.log.debug),
        pos.x + mp.x, maxClimbY,
        pos.x + mp.x, pos.y,
        this.log.debug)
      if (wallAhead) {
        this.log.debug(`checking slope ahead of entity: ${wallAhead.y} vs ${maxClimbY}`)
        if (wallAhead.y != maxClimbY) {
          this.log.debug(`climbing with move_plan.y = ${mp.y}`)
          mp.y = wallAhead.y - pos.y - 1
          this.log.debug(`..set move_plan.y to ${mp.y} (=${wallAhead.y} - ${pos.y} - 1)`)
        }
        else {
          this.log.debug('collision with wall')
          // a collision happened
          v.x = 0
          mp.x = 0
        }
      }
    }

    var x0 = pos.x, x1 = pos.x
    var y0 = pos.y, y1 = pos.y + 2
    //this.log.debug(`checking for an edge below us (position ${pos.x},${pos.y}) from ${x0},${y0} to ${x1},${y1}`)
      var edgeBelow = castLine(
        getCollisionPredicate(map, entity),
        x0, y0, x1, y1)
    if (edgeBelow) {
      //this.log.debug(`edgeBelow found at ${edgeBelow.x},${edgeBelow.y}`)
    }
    if (mp.y > 0) { // TODO: should this check for FALLING instead? are those equivalent?
      // check for an edge up to two pixels below us
      if (edgeBelow) {
        this.log.debug(`collision with ground at ${edgeBelow.x},${edgeBelow.y}: setting position to ${edgeBelow.x},${edgeBelow.y-1}, vy to 0 and mpy to 0`)
        pos.x = edgeBelow.x
        pos.y = edgeBelow.y-1
        v.y = 0
        mp.y = 0
        ps.state = PlayerStateComponent.STANDING
      }
    } 

    if (!edgeBelow) {
      this.log.debug('starting to fall')
      ps.state = PlayerStateComponent.FALLING
      v.y = 60
    }
  }

  this.apply_move_plan = function(game, entity) {
    entity.position.x += entity.move_plan.x
    entity.position.y += entity.move_plan.y
  }

}

export default VelocitySystem
