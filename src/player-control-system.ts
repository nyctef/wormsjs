import { Entity } from "./entity";
import { KeyboardInputComponent } from "./keyboard-input-component";
import { PlayerStateComponent } from "./playerstate-component";
import { VelocityComponent } from "./velocity-component";

const PlayerControlSystem = {
  update: function(entity: Entity) {
    const { player_state, keyboard_input, velocity } = entity;
    if (!player_state || !keyboard_input || !velocity) {
      return;
    }
    if (player_state.state === "STANDING") {
      this.standing(keyboard_input, player_state);
    } else if (player_state.state === "WALKING") {
      this.walking(keyboard_input, player_state, velocity);
    }
  },

  standing: function(
    keyboard_input: KeyboardInputComponent,
    player_state: PlayerStateComponent
  ) {
    if (keyboard_input.left || keyboard_input.right) {
      player_state.state = "WALKING";
      return;
    }
  },

  walking: function(
    keyboard_input: KeyboardInputComponent,
    player_state: PlayerStateComponent,
    velocity: VelocityComponent
  ) {
    // start moving left or right if the keyboard buttons are held
    let sx;
    if (keyboard_input.left) {
      sx = -1;
    } else if (keyboard_input.right) {
      sx = +1;
    } else {
      velocity.dx = 0;
      player_state.state = "STANDING";
      return;
    }
    velocity.dx = sx * 10;
  }
};

export default PlayerControlSystem;
