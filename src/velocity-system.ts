import * as loglevel from "loglevel";
import { Entity } from "./entity";
import { HasMapDataAt, Map } from "./map";
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

export type CollisionEvent =
  | {
      type: "WALKING_INTERRUPTED";
      id: number;
      velocity: { dx: number; dy: number };
      wallAhead: { x: number; y: number };
    }
  | {
      type: "FALLING_INTERRUPTED";
      id: number;
      velocity: { dx: number; dy: number };
      edgeBelow: { x: number; y: number };
    }
  | {
      type: "STARTING_TO_FALL";
      id: number;
    };

export class VelocitySystem {
  frame_counter: number;
  log: log.Logger;

  constructor(log: log.Logger) {
    this.log = log.getLogger("VelocitySystem");
    this.frame_counter = 0;
  }

  start_frame = () => {
    this.frame_counter++;
  };

  /**
   * reads: velocity
   * writes: move_plan
   */
  set_move_plan = (entities: Entity[]) => {
    // vel 1 => vel +1 when fc % 60 == 0
    // vel 2 => vel +1 when fc % 30 == 0
    // vel 3 => vel +1 when fc % 20 == 0
    // vel 60 => vel +1 when fc % 1 == 0
    // TODO:
    // vel 45 => ?
    // vel 46 => ?
    // vel 120 => vel +2 when fc % 1 == 0
    // vel 90 => vel +1 when fc % 2 == 0 and vel +2 when fc % 2 == 1
    // will other systems start breaking if we move more than one pixel/frame?

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (!entity.move_plan || !entity.velocity) {
        continue;
      }
      const dx = entity.velocity.dx;
      const dy = entity.velocity.dy;
      const sx = sign(dx);
      const sy = sign(dy);
      if (((this.frame_counter % (60 / dx)) | 0) === 0) {
        entity.move_plan.x = sx;
      } else {
        entity.move_plan.x = 0;
      }
      if (((this.frame_counter % (60 / dy)) | 0) === 0) {
        entity.move_plan.y = sy;
      } else {
        entity.move_plan.y = 0;
      }
    }
  };

  noop = (str: string) => {};

  getCollisionPredicate = (
    map: HasMapDataAt,
    entity: Entity,
    doLog = this.noop
  ) => {
    const size = entity.size;
    const shape = entity.shape;
    if (!size || !shape) {
      throw new Error("invalid entity for getCollisionPredicate");
    }

    return (x0: number, y0: number) => {
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
   * reads: position, move_plan, velocity
   * writes: move_plan
   * returns: collisions
   *
   * TODO: can we simplify the above a bit?
   * player_state/velocity might want to be set separately by a collision event
   * (since we want to collide more things than players)
   */
  check_collisions = (
    map: HasMapDataAt,
    entities: Entity[]
  ): CollisionEvent[] => {
    const collisions: CollisionEvent[] = [];

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const pos = entity.position;
      const mp = entity.move_plan;
      const v = entity.velocity;
      if (!pos || !mp || !v) {
        continue;
      }

      if (mp.x !== 0) {
        // todo: this assumes move_plan.x is 1 at most
        if (mp.x > 1) {
          this.log.warn("don't know how to deal with a moveplan >1 px");
        }
        // TODO: this wallAhead/maxClimb logic is very player-specific;
        // might need to pull out into an event and handle separately
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
            collisions.push({
              type: "WALKING_INTERRUPTED",
              id: entity.id,
              velocity: v,
              wallAhead
            });
            mp.x = 0;
          }
        }
      }

      // todo: this doesn't cope with falling faster than 1px per frame
      const x0 = pos.x,
        x1 = pos.x;
      const y0 = pos.y,
        y1 = pos.y + 1;
      //log.debug(`checking for an edge below us (position ${pos.x},${pos.y}) from ${x0},${y0} to ${x1},${y1}`)
      const edgeBelow = castLine(
        this.getCollisionPredicate(map, entity),
        x0,
        y0,
        x1,
        y1
      );
      if (edgeBelow) {
        //log.debug(`edgeBelow found at ${edgeBelow.x},${edgeBelow.y}`)
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
          collisions.push({
            type: "FALLING_INTERRUPTED",
            id: entity.id,
            velocity: v,
            edgeBelow
          });
          mp.y = 0;
        }
      } else if (!edgeBelow) {
        this.log.debug("starting to fall");
        collisions.push({
          type: "STARTING_TO_FALL",
          id: entity.id
        });
      }
    }

    return collisions;
  };

  /**
   * writes: player_state, velocity
   *
   * TODO: maybe move this function off velocity-system since we want
   * reactions to collisions to be properly independent of the collision logic
   */
  handle_player_collisions = (
    entities: Entity[],
    collisions: CollisionEvent[]
  ) => {
    for (let c = 0; c < collisions.length; c++) {
      const collision = collisions[c];
      const entity = entities[collision.id];
      const { velocity, player_state } = entity;
      if (!velocity || !player_state) {
        continue;
      }

      switch (collision.type) {
        case "STARTING_TO_FALL":
          // TODO probably want acceleration here
          velocity.dy += 10;
          if (velocity.dy > 60) {
            velocity.dy = 60;
          }
          player_state.state = "FALLING";
          break;

        case "FALLING_INTERRUPTED":
          velocity.dy = velocity.dx = 0;
          player_state.state = "STANDING";
          break;

        case "WALKING_INTERRUPTED":
          velocity.dx = 0;
          break;
      }
    }
  };

  /**
   * reads: move_plan
   * writes: position
   */
  apply_move_plan = (entities: Entity[]) => {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (!entity.position || !entity.move_plan) {
        continue;
      }

      entity.position.x += entity.move_plan.x;
      entity.position.y += entity.move_plan.y;
    }
  };
}
