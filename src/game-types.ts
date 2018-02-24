import { Map } from './map';

export interface GameOptions {
  drawEdgePixelData: boolean;
}

export interface Game {
  log: log.Logger;
  map: Map;
  options: GameOptions;
}
