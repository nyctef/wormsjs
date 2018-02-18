import KeyboardInputComponent from "./keyboard-input-component";
import PositionComponent from "./position-component";
import VelocityComponent from "./velocity-component";
import MovePlanComponent from "./moveplan-component";
import PlayerStateComponent from "./playerstate-component";
import * as d from "./drawing";

var Player = function() {
  this.keyboard_input = new KeyboardInputComponent();
  this.position = new PositionComponent(60, 50);
  this.velocity = new VelocityComponent(0, 0);
  this.move_plan = new MovePlanComponent(0, 0);
  this.player_state = new PlayerStateComponent();
  // TODO: should these also be component things?
  this.size = { width: 5, height: 7 };
  this.shape = [
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    0
  ];
  this.appearance = new d.AppearanceComponent("shape", {
    size: this.size,
    shape: this.shape,
    color: "green"
  });
};

export default Player;
