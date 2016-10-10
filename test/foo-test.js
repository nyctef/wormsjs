import chai from 'chai'
import sinon from 'sinon'
import log from 'loglevel'

import VelocitySystem from '../src/velocity-system'
import VelocityComponent from '../src/velocity-component'
import MovePlanComponent from '../src/moveplan-component'
import PlayerStateComponent from '../src/playerstate-component'
import PositionComponent from '../src/position-component'

var expect = chai.expect

function TestEntity() {
  this.velocity = new VelocityComponent()
  this.move_plan = new MovePlanComponent()
  this.player_state = new PlayerStateComponent()
  this.position = new PositionComponent()
  this.size = { width: 2, height: 2 }
  this.shape = [ 1,1, 1,1 ]
}

function testEntityFactory(opts) {
  var e = new TestEntity()
  e.velocity.x = opts.vx || 0
  e.velocity.y = opts.vy || 0
  e.position.x = opts.posx || 0
  e.position.y = opts.posy || 0
  e.move_plan.x = opts.movx || 0
  e.move_plan.y = opts.movy || 0
  return e
}

function MapData() { }

function TestMap(width, height, data) {
  this._w = width
  this._h = height
  this._data = data
  // TODO: this is a copy/paste of the real mapDataAt function, 
  // which indicates that Map should probably get split up a bit more
  this.mapDataAt = function(x, y) {
    var result = new MapData()
    if (x<0 || x>=this._w ||
        y<0 || y>=this._h) { 
          result.isEdge = true
          return result
    }
    result.isEdge = this._data[(y*this._w) + x]
    return result
  }
}

function testMapFactory(opts) {
  var defaultData = [
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
  ]
  return new TestMap(
    opts.w || 5,
    opts.h || 8,
    opts.data || defaultData)
}

describe('VelocitySystem', () => {
  beforeEach(function() {
    this.vs_state = {}
    this.vs = new VelocitySystem(this.vs_state)
    this.game = null
    this.entity = new TestEntity()
    log.getLogger('VelocitySystem').setLevel('warn')
  })

  describe('#set_move_plan', () => {
    it('converts a velocity into a move plan in appropriate frames', function() {

      var e = testEntityFactory({ vx: 1 })

      this.vs.set_move_plan(this.game, e)

      // with a velocity of 1, we want to move 1 on 1/60 frames
      expect(e.move_plan.x).to.equal(1)
    })
    it('does not set the move plan in other frames', function() {

      var e = testEntityFactory({ vx: 1 })
      this.vs.start_frame()

      this.vs.set_move_plan(this.game, e)

      // with a velocity of 1, we only want to actually move every 60 frames
      expect(e.move_plan.x).to.equal(0)
    })
  })
  describe('#check_collisions', function() {
    it('collides with a wall in front of the entity', function() {
      //log.getLogger('VelocitySystem').setLevel('trace')

      var map = testMapFactory({data: 
        [ 0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0,
          0,0,0,1,0 ]})
      expect(map.mapDataAt(3, 0).isEdge).to.be.ok // 'ok' means truthy here
      expect(map.mapDataAt(4, 0).isEdge).to.not.be.ok

      var e = testEntityFactory({
        // put the entity where it should just be touching the wall (since it is 2 pixels wide)
        posx: 1, posy: 3,
        // and set it moving rightwards
        movx: 1
      })

      this.vs.check_collisions(map, e)

      // we've hit a wall, so we alter the move-plan to be stopped
      expect(e.move_plan.x).to.equal(0)
    })

    it("doesn't collide with the top of the map if moving right (#23)", function() {
      var map = testMapFactory({ data:
        [ 0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0 ]})

      var e = testEntityFactory({
        // put the entity where it is touching the top of the map
        posx: 1, posy: 0,
        // and set it moving rightwards
        movx: 1
      })

      this.vs.check_collisions(map, e)

      // there isn't a wall to the right, so we should continue rightwards
      expect(e.move_plan.x).to.equal(1)
    })

    it("falls to the ground if there is one pixel of space (#24)", function() {
      //log.getLogger('VelocitySystem').setLevel('trace')
      var map = testMapFactory({ data:
        [ 0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          0,0,0,0,0,
          1,1,1,1,1,
          0,0,0,0,0,
          0,0,0,0,0 ]})

      var e = testEntityFactory({
        // put the entity where it is just above the ground line
        posx: 1, posy: 2
      })

      this.vs.check_collisions(map, e)

      // there is a gap below, so we should start falling
      expect(e.velocity.y).to.be.above(0)
    })
  })
})
