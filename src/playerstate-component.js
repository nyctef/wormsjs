var PlayerStateComponent = function() {
  PlayerStateComponent.FALLING = 0
  PlayerStateComponent.STANDING = 1
  PlayerStateComponent.WALKING = 2

  this.state = PlayerStateComponent.FALLING
  // TODO: also need to store state data in here?
}

export default PlayerStateComponent
