import PlayerStateComponent from "./playerstate-component";

var PlayerControlSystem = function() {
  // TODO: this should probably be the only entity actually on a player (KeyboardInputSystem doesn't need to be duplicated everywhere)
  this.update = function(game, entity) {
    if (entity.player_state.state == PlayerStateComponent.STANDING) {
      this.standing(entity);
    } else if (entity.player_state.state == PlayerStateComponent.WALKING) {
      this.walking(entity);
    }
  };

  this.standing = function(entity) {
    if (entity.keyboard_input.left || entity.keyboard_input.right) {
      entity.player_state.state = PlayerStateComponent.WALKING;
      return;
    }
  };

  this.walking = function(entity) {
    // start moving left or right if the keyboard buttons are held
    var sx;
    if (entity.keyboard_input.left) {
      sx = -1;
    } else if (entity.keyboard_input.right) {
      sx = +1;
    } else {
      entity.velocity.x = 0;
      entity.player_state.state = PlayerStateComponent.STANDING;
      return;
    }
    entity.velocity.x = sx * 10;
  };
};

export default PlayerControlSystem;
