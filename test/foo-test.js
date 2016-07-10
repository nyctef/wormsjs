import chai from 'chai'
import VelocitySystem from '../src/velocity-system'
import VelocityComponent from '../src/velocity-component'
import MovePlanComponent from '../src/moveplan-component'
var expect = chai.expect

function TestEntity() {
  this.velocity = new VelocityComponent()
  this.move_plan = new MovePlanComponent()
}

describe('VelocitySystem', () => {
  beforeEach(function() {
    this.vs = new VelocitySystem()
  })

  describe('#set_move_plan', () => {
    it('converts a velocity into a move plan in appropriate frames', function() {

      var e = new TestEntity()
      e.velocity.x = 1

      this.vs.set_move_plan(null, e)

      expect(e.move_plan.x).to.equal(1)
    })
  })
})
