var Player = function(game) {
  this.game = game
  this.keyboard = new Keyboard()
  this.position = { x: 60, y: 50 }
  this.draw = function(screen) {
    screen.drawCircle(this.position.x, this.position.y, 1, 'green')
  }
  this.update = function() {
    this.state()
  }

  this.falling = function() {
    var edgeBelow = this.game.castLine(this.position.x, this.position.y+1,
                                       this.position.x, this.position.y+2)
    if (edgeBelow) {
      this.position.x = edgeBelow.x
      this.position.y = edgeBelow.y-1
      this.state = this.standing
    }
    else {
      this.position.y += 2
    }
  }

  this.standing = function() {
    var sx
    if (this.keyboard.isDown(this.keyboard.Keys.LEFT)) {
      sx = -1
    } else if (this.keyboard.isDown(this.keyboard.Keys.RIGHT)) {
      sx = +1
    } else {
      return
    }

    var newX = this.position.x + 2*sx
    if (!(this.game.mapData)) {
      return
    }
    var wallAhead = this.game.castLine(this.position.x, this.position.y,
                                       newX, this.position.y)
    if (wallAhead) { this.position.x = wallAhead.x - 1*sx }
    else { this.position.x = newX }

    if (!this.game.mapDataAt(newX, this.position.y+1).isEdge) {
      this.state = this.falling
      return
    }
  }

  this.state = this.falling
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
