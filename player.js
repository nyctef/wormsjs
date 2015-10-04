var Player = function(game) {
  this.game = game
  this.keyboard = new Keyboard(),
  this.position = { x: 50, y: 50 }
  this.draw = function(screen) {
    screen.drawCircle(this.position.x, this.position.y, 2, 'green')
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
    if (!(this.game.edgePixelData)) {
      return
    }
    var alpha = this.game.edgePixelData.data[(this.position.y * 4 * this.game.size.x) + (newX * 4) + 3]
    if (alpha <= 0) {
      this.position.x = newX
    }
  }
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
