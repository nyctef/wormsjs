import { Map } from "./map";

export interface GameOptions {
  drawEdgePixelData: boolean;
}

export interface Game {
  log: log.Logger;
  size: { x: number; y: number };
  map: Map;
  options: GameOptions;
}
