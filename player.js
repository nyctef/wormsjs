var Player = function(game) {
  this.game = game
  this.keyboard = new Keyboard()
  this.position = { x: 60, y: 50 }
  this.stateData = {}
  this.draw = function(screen) {
    screen.drawRect(this.position.x, this.position.y, 1, 1, 'green')
  }
  this.update = function() {
    this.state()
  }
  this.canFall = function() {
    // if there is no solid ground beneath us then start falling
    return !this.game.mapDataAt(this.position.x, this.position.y+1).isEdge
  }

  this.falling = function() {
    // check for an edge up to two pixels below us
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
    if (this.canFall()) {
      this.state = this.falling
      return
    }

    if (this.keyboard.isDown(this.keyboard.Keys.LEFT) ||
        this.keyboard.isDown(this.keyboard.Keys.RIGHT)) {
      this.stateData.walkDelay = 0
      this.state = this.walking
      return
    }
  }

  this.walking = function () {
    if (this.canFall()) {
      this.state = this.falling
      return
    }

    if (this.stateData.walkDelay) {
      this.stateData.walkDelay--
      return
    }
    // start moving left or right if the keyboard buttons are held
    var sx
    if (this.keyboard.isDown(this.keyboard.Keys.LEFT)) {
      sx = -1
    } else if (this.keyboard.isDown(this.keyboard.Keys.RIGHT)) {
      sx = +1
    } else {
      this.state = this.standing
      return
    }

    var newX = this.position.x + sx
    if (!(this.game.mapData)) {
      return
    }
    var wallAhead = this.game.castLine(this.position.x, this.position.y,
                                       newX, this.position.y)
    if (wallAhead) { this.position.x = wallAhead.x - 1*sx }
    else { this.position.x = newX }

    this.stateData.walkDelay = 3
  }

  this.state = this.falling
}

// TODO: pull out control code and start working on climbing / jumping / falling behaviours
