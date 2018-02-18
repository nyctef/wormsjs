import * as d from "./drawing";
import KeyboardInputComponent from "./keyboard-input-component";
import MovePlanComponent from "./moveplan-component";
import PlayerStateComponent from "./playerstate-component";
import PositionComponent from "./position-component";
import VelocityComponent from "./velocity-component";

class Player {
  keyboard_input: {
    left: boolean | undefined;
    right: boolean | undefined;
    jump: boolean | undefined;
    fire: boolean | undefined;
  };
  position: { x: number; y: number };
  velocity: { dx: number; dy: number };
  move_plan: { x: number; y: number };
  player_state: { state: any };
  size: { width: number; height: number };
  shape: number[];
  appearance: { type: any; data: any };

  constructor() {
    this.keyboard_input = new KeyboardInputComponent();
    this.position = new PositionComponent(60, 50);
    this.velocity = new VelocityComponent(0, 0);
    this.move_plan = new MovePlanComponent(0, 0);
    this.player_state = new PlayerStateComponent();
    // TODO: should these also be component things?
    this.size = { width: 5, height: 7 };
    // prettier-ignore
    this.shape = [
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 0,
      0, 0, 1, 0, 0
    ];
    this.appearance = new d.AppearanceComponent("shape", {
      size: this.size,
      shape: this.shape,
      color: "green"
    });
  }
}

export default Player;
