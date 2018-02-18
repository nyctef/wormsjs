import {
  AppearanceComponent,
  KeyboardInputComponent,
  MovePlanComponent,
  PlayerStateComponent,
  PositionComponent,
  ShapeComponent,
  SizeComponent,
  VelocityComponent
} from "./component-types";

export interface Entity {
  ["keyboard_input"]?: KeyboardInputComponent;
  ["position"]?: PositionComponent;
  ["velocity"]?: VelocityComponent;
  ["move_plan"]?: MovePlanComponent;
  ["player_state"]?: PlayerStateComponent;
  ["size"]?: SizeComponent;
  ["shape"]?: ShapeComponent;
  ["appearance"]?: AppearanceComponent;
}
