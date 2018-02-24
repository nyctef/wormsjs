import { Entity } from "./entity";
import { Keyboard } from "./keyboard";

export function updateKeyboard(keyboard: Keyboard, entities: Entity[]) {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    if (!entity.keyboard_input) {
      continue;
    }

    let left = keyboard.isDown(Keyboard.Keys.LEFT);
    let right = keyboard.isDown(Keyboard.Keys.RIGHT);
    const space = keyboard.isDown(Keyboard.Keys.SPACE);

    if (left && right) {
      left = right = false;
    }

    entity.keyboard_input.left = left;
    entity.keyboard_input.right = right;
    entity.keyboard_input.jump = space;
  }
}
