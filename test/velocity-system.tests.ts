import { expect } from "chai";
import * as log from "loglevel";
import * as sinon from "sinon";

import { Entity } from "../src/entity";
import { VelocitySystem } from "../src/velocity-system";

function TestEntity(): Entity {
  return {
    velocity: { dx: 0, dy: 0 },
    move_plan: { x: 0, y: 0 },
    player_state: { state: "FALLING" },
    position: { x: 0, y: 0 },
    size: { width: 2, height: 2 },
    shape: [1, 1, 1, 1]
  };
}

function testEntityFactory(opts: {
  vx?: number;
  vy?: number;
  posx?: number;
  posy?: number;
  movx?: number;
  movy?: number;
}) {
  const e = TestEntity();
  e.velocity!.dx = opts.vx || 0;
  e.velocity!.dy = opts.vy || 0;
  e.position!.x = opts.posx || 0;
  e.position!.y = opts.posy || 0;
  e.move_plan!.x = opts.movx || 0;
  e.move_plan!.y = opts.movy || 0;
  return e;
}

function TestMap(width: number, height: number, data: number[]) {
  return {
    _w: width,
    _h: height,
    _data: data,
    // TODO: this is a copy/paste of the real mapDataAt function,
    // which indicates that Map should probably get split up a bit more
    mapDataAt: function(x: number, y: number) {
      if (x < 0 || x >= this._w || y < 0 || y >= this._h) {
        return { isEdge: true };
      }
      return { isEdge: this._data[y * this._w + x] };
    }
  };
}

function testMapFactory(opts: { w?: number; h?: number; data?: number[] }) {
  // prettier-ignore
  const defaultData = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
  ];
  return TestMap(opts.w || 5, opts.h || 8, opts.data || defaultData);
}

describe("VelocitySystem", () => {
  beforeEach(function() {
    this.vs = new VelocitySystem();
    this.entity = TestEntity();
    log.getLogger("VelocitySystem").setLevel("warn");
  });

  describe("#set_move_plan", () => {
    it("converts a velocity into a move plan in appropriate frames", function() {
      const e = testEntityFactory({ vx: 1 });

      this.vs.set_move_plan(e);

      // with a velocity of 1, we want to move 1 on 1/60 frames
      expect(e.move_plan!.x).to.equal(1);
    });
    it("does not set the move plan in other frames", function() {
      const e = testEntityFactory({ vx: 1 });
      this.vs.start_frame();

      this.vs.set_move_plan(e);

      // with a velocity of 1, we only want to actually move every 60 frames
      expect(e.move_plan!.x).to.equal(0);
    });
  });
  describe("#check_collisions", () => {
    it("collides with a wall in front of the entity", function() {
      //log.getLogger('VelocitySystem').setLevel('trace')

      const map = testMapFactory({
        // prettier-ignore
        data: [
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 1, 0
        ]
      });
      expect(map.mapDataAt(3, 0).isEdge).to.be.ok; // 'ok' means truthy here
      expect(map.mapDataAt(4, 0).isEdge).to.not.be.ok;

      const e = testEntityFactory({
        // put the entity where it should just be touching the wall (since it is 2 pixels wide)
        posx: 1,
        posy: 3,
        // and set it moving rightwards
        movx: 1
      });

      this.vs.check_collisions(map, e);

      // we've hit a wall, so we alter the move-plan to be stopped
      expect(e.move_plan!.x).to.equal(0);
    });

    it("doesn't collide with the top of the map if moving right (#23)", function() {
      const map = testMapFactory({
        // prettier-ignore
        data: [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ]
      });

      const e = testEntityFactory({
        // put the entity where it is touching the top of the map
        posx: 1,
        posy: 0,
        // and set it moving rightwards
        movx: 1
      });

      this.vs.check_collisions(map, e);

      // there isn't a wall to the right, so we should continue rightwards
      expect(e.move_plan!.x).to.equal(1);
    });

    it("falls to the ground if there is one pixel of space (#24)", function() {
      //log.getLogger('VelocitySystem').setLevel('trace')
      const map = testMapFactory({
        // prettier-ignore
        data: [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          1, 1, 1, 1, 1,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ]
      });

      const e = testEntityFactory({
        // put the entity where it is just above the ground line
        posx: 1,
        posy: 2
      });

      this.vs.check_collisions(map, e);

      // there is a gap below, so we should start falling
      expect(e.velocity!.dy).to.be.above(0);
    });

    it("stops horizontal movement when hitting the ground", function() {
      //log.getLogger('VelocitySystem').setLevel('trace')
      const map = testMapFactory({
        // prettier-ignore
        data: [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          1, 1, 1, 1, 1,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ]
      });

      const e = testEntityFactory({
        // put the entity where it will hit the ground
        posx: 1,
        posy: 3,
        vx: 3,
        vy: 10,
        movx: 3,
        movy: 10
      });

      this.vs.check_collisions(map, e);

      expect(e.velocity!.dy).to.equal(0);
      expect(e.velocity!.dx).to.equal(0);
    });
  });
});
