var Player = function(game) {
  this.game = game
  this.keyboard = new Keyboard(),
  this.position = { x: 50, y: 50 }
  this.draw = function(screen) {
    screen.drawCircle(this.position.x, this.position.y, 1, 'green')
  }
  this.update = function() {
    var newX
    if (this.keyboard.isDown(this.keyboard.Keys.LEFT)) {
      newX = this.position.x - 2
    } else if (this.keyboard.isDown(this.keyboard.Keys.RIGHT)) {
      newX = this.position.x + 2
    } else {
      return
    }
    if (!(this.game.mapData)) {
      return
    }
    if (!this.game.mapDataAt(newX-1, this.position.y).isEdge &&
        !this.game.mapDataAt(newX  , this.position.y).isEdge) {
      this.position.x = newX
    }
  }
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
