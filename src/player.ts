import { newKeyboardInputComponent } from "./component-types";
import * as d from "./drawing";
import { Entity } from "./entity";

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
    keyboard_input: newKeyboardInputComponent(),
    position: { x: posx, y: posy },
    velocity: { dx: 0, dy: 0 },
    move_plan: { x: 0, y: 0 },
    player_state: { state: "FALLING" },
    // TODO: should these also be component things?
    size: size,
    shape: shape,
    appearance: {
      type: "shape",
      data: {
        size: size,
        shape: shape,
        color: "green"
      }
    }
  };
}

export default Player;
