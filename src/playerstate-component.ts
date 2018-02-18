export type PlayerState = "FALLING" | "STANDING" | "WALKING";

export interface PlayerStateComponent {
  // TODO: also need to store state data in here?
  state: PlayerState;
}
