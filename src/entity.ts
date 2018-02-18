import { AppearanceComponent } from "./appearance-component";
import { KeyboardInputComponent } from "./keyboard-input-component";
import { MovePlanComponent } from "./moveplan-component";
import { PlayerStateComponent } from "./playerstate-component";
import { PositionComponent } from "./position-component";
import { VelocityComponent } from "./velocity-component";

export interface Entity {
  ["keyboard_input"]?: KeyboardInputComponent;
  ["position"]?: PositionComponent;
  ["velocity"]?: VelocityComponent;
  ["move_plan"]?: MovePlanComponent;
  ["player_state"]?: PlayerStateComponent;
  ["size"]?: { width: number; height: number };
  ["shape"]?: number[];
  ["appearance"]?: AppearanceComponent;
}
