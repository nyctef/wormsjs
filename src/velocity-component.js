// measured in pixels per second (eg 60 would be one pixel per frame)
var VelocityComponent = function(dx, dy) {
  this.dx = dx || 0
  this.dy = dy || 0
}

export default VelocityComponent
