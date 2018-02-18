export type AppearanceComponent =
  | {
      type: "rectangle";
      data: { rect: { height: number; width: number; color: string } };
    }
  | {
      type: "shape";
      data: {
        size: { width: number; height: number };
        shape: number[];
        color: string;
      };
    };

export interface KeyboardInputComponent {
  left: boolean;
  right: boolean;
  jump: boolean;
  fire: boolean;
}

export const newKeyboardInputComponent = (): KeyboardInputComponent => {
  return {
    left: false,
    right: false,
    jump: false,
    fire: false
  };
};

export interface MovePlanComponent {
  x: number;
  y: number;
}

export type PlayerState = "FALLING" | "STANDING" | "WALKING";

export interface PlayerStateComponent {
  // TODO: also need to store state data in here?
  state: PlayerState;
}

export interface PositionComponent {
  x: number;
  y: number;
}

/** measured in pixels per second (eg 60 would be one pixel per frame) */
export interface VelocityComponent {
  dx: number;
  dy: number;
}

export interface SizeComponent {
  width: number;
  height: number;
}

export type ShapeComponent = number[];
