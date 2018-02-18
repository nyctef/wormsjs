import * as log from "loglevel";
import { Entity } from "./entity";
import { Map } from "./map";
import { castLine } from "./math";

function sign(x: number) {
  if (x < 0) {
    return -1;
  }
  if (x === 0) {
    return 0;
  }
  return 1;
}

export class VelocitySystem {
  frame_counter: number;
  start_frame: () => void;
  log: log.Logger;

  constructor() {
    this.log = log.getLogger("VelocitySystem");
    this.frame_counter = 0;
    this.start_frame = function() {
      this.frame_counter++;
    };
  }

  // vel 1 => vel +1 when fc % 60 == 0
  // vel 2 => vel +1 when fc % 30 == 0
  // vel 3 => vel +1 when fc % 20 == 0
  // vel 60 => vel +1 when fc % 1 == 0
  // TODO:
  // vel 120 => vel +2 when fc % 1 == 0
  // vel 90 => vel +1 when fc % 2 == 0 and vel +2 when fc % 2 == 1
  // will other systems start breaking if we move more than one pixel/frame?

  /**
   * reads: velocity
   * writes: move_plan
   */
  set_move_plan = (entity: Entity) => {
    if (!entity.move_plan || !entity.velocity) {
      return;
    }
    const dx = entity.velocity.dx;
    const dy = entity.velocity.dy;
    const sx = sign(dx);
    const sy = sign(dy);
    if (this.frame_counter % (60 / dx) === 0) {
      entity.move_plan.x = sx;
    } else {
      entity.move_plan.x = 0;
    }
    if (this.frame_counter % (60 / dy) === 0) {
      entity.move_plan.y = sy;
    } else {
      entity.move_plan.y = 0;
    }
  };

  noop = (str: string) => {};

  getCollisionPredicate = (map: Map, entity: Entity, doLog = this.noop) => {
    return (x0: number, y0: number) => {
      const size = entity.size;
      const shape = entity.shape;
      if (!size || !shape) {
        return false;
      }
      for (let x = 0; x < size.width; x++) {
        for (let y = 0; y < size.height; y++) {
          if (
            shape[y * size.width + x] &&
            map.mapDataAt(x0 + x, y0 + y).isEdge
          ) {
            doLog(
              `found a collision between position ${x},${y} in shape with point ${x0 +
                x},${y0 + y} in map`
            );
            return true;
          }
        }
      }
      return false;
    };
  };

  /**
   * reads: position, move_plan
   * writes: position, move_plan, player_state, velocity
   *
   * TODO: can we simplify the above a bit?
   * We shouldn't need to set position if we set move_plan correctly
   * player_state/velocity might want to be set separately by a collision event
   * (since we want to collide more things than players)
   */
  check_collisions = (map: Map, entity: Entity) => {
    const pos = entity.position;
    const mp = entity.move_plan;
    const ps = entity.player_state;
    const v = entity.velocity;

    if (!pos || !mp || !ps || !v) {
      return;
    }

    if (mp.x !== 0) {
      // todo: this assumes move_plan.x is 1 at most
      if (mp.x > 1) {
        this.log.warn("don't know how to deal with a moveplan >1 px");
      }
      const maxClimbY = Math.max(0, pos.y - 2);
      this.log.debug(
        `checking for a wall in front of us (position ${pos.x},${pos.y}) ` +
          `from ${pos.x + mp.x},${maxClimbY} ` +
          `to   ${pos.x + mp.x},${pos.y}`
      );
      const wallAhead = castLine(
        this.getCollisionPredicate(map, entity, this.log.debug),
        pos.x + mp.x,
        maxClimbY,
        pos.x + mp.x,
        pos.y,
        this.log.debug
      );
      if (wallAhead) {
        this.log.debug(
          `checking slope ahead of entity: ${wallAhead.y} vs ${maxClimbY}`
        );
        if (wallAhead.y !== maxClimbY) {
          this.log.debug(`climbing with move_plan.y = ${mp.y}`);
          mp.y = wallAhead.y - pos.y - 1;
          this.log.debug(
            `..set move_plan.y to ${mp.y} (=${wallAhead.y} - ${pos.y} - 1)`
          );
        } else {
          this.log.debug("collision with wall");
          // a collision happened
          v.dx = 0;
          mp.x = 0;
        }
      }
    }

    // todo: this doesn't cope with falling faster than 1px per frame
    const x0 = pos.x,
      x1 = pos.x;
    const y0 = pos.y,
      y1 = pos.y + 1;
    //this.log.debug(`checking for an edge below us (position ${pos.x},${pos.y}) from ${x0},${y0} to ${x1},${y1}`)
    const edgeBelow = castLine(
      this.getCollisionPredicate(map, entity),
      x0,
      y0,
      x1,
      y1
    );
    if (edgeBelow) {
      //this.log.debug(`edgeBelow found at ${edgeBelow.x},${edgeBelow.y}`)
    }
    if (mp.y > 0) {
      // TODO: should this check for FALLING instead? are those equivalent?
      if (edgeBelow) {
        this.log.debug(
          `collision with ground at ${edgeBelow.x},${
            edgeBelow.y
          }: setting position to ${edgeBelow.x},${edgeBelow.y -
            1}, vy to 0 and mpy to 0`
        );
        pos.x = edgeBelow.x;
        pos.y = edgeBelow.y - 1;
        v.dy = v.dx = 0;
        mp.y = 0;
        ps.state = "STANDING";
      }
    }

    if (!edgeBelow) {
      this.log.debug("starting to fall");
      ps.state = "FALLING";
      v.dy = 60;
    }
  };

  /**
   * reads: move_plan
   * writes: position
   */
  apply_move_plan = (entity: Entity) => {
    if (!entity.position || !entity.move_plan) {
      return;
    }
    entity.position.x += entity.move_plan.x;
    entity.position.y += entity.move_plan.y;
  };
}
