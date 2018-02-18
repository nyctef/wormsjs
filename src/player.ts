import * as d from "./drawing";
import KeyboardInputComponent from "./keyboard-input-component";
import MovePlanComponent from "./moveplan-component";
import PlayerStateComponent from "./playerstate-component";
import PositionComponent from "./position-component";
import VelocityComponent from "./velocity-component";

interface Entity {
  ["keyboard_input"]?: {};
  ["position"]?: { x: number; y: number };
  ["velocity"]?: {};
  ["move_plan"]?: {};
  ["player_state"]?: {};
  ["size"]?: { width: number; height: number };
  ["shape"]?: number[];
  ["appearance"]?: {
    type: string /*TODO:enum*/;
    data: {
      size: { width: number; height: number };
      shape: number[];
      color: string;
    };
  };
}

function Player(posx: number, posy: number): Entity {
  // prettier-ignore
  const shape = [
    0, 0, 1, 0, 0,
    0, 1, 1, 1, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0
  ];
  const size = { width: 5, height: 7 };

  return {
    keyboard_input: new KeyboardInputComponent(),
    position: new PositionComponent(posx, posy),
    velocity: new VelocityComponent(0, 0),
    move_plan: new MovePlanComponent(0, 0),
    player_state: new PlayerStateComponent(),
    // TODO: should these also be component things?
    size: size,
    shape: shape,
    appearance: new d.AppearanceComponent("shape", {
      size: size,
      shape: shape,
      color: "green"
    })
  };
}

export default Player;
