import * as log from "loglevel";

const edge = { isEdge: true };

const R = 0;
const G = 1;
const B = 2;
const A = 3;

function getEdgePixelData(mapInput: ImageData, mapData: PixelData[]) {
  const gameWidth = mapInput.width;
  const gameHeight = mapInput.height;
  const imageData = mapInput.data;
  const pixelWidth = gameWidth * 4;
  const pixelHeight = pixelWidth * gameHeight;
  for (let i = 0; i < imageData.length; i += 4) {
    if (imageData[i + A] === 0) {
      mapData[i / 4].isEdge = false;
      continue;
    }

    if (
      (i > pixelWidth && imageData[i - pixelWidth + A] === 0) ||
      (i % pixelWidth > 0 && imageData[i - 4 + A] === 0) ||
      (i % pixelWidth < pixelWidth - 1 && imageData[i + 4 + A] === 0) ||
      (i < pixelHeight - pixelWidth && imageData[i + pixelWidth + A] === 0)
    ) {
      mapData[i / 4].isEdge = true;
    } else {
      mapData[i / 4].isEdge = false;
    }
  }
}

export interface HasMapDataAt {
  mapDataAt: (x: number, y: number) => PixelData;
}

export class Map {
  _mapData: PixelData[];
  _imageData: ImageData;
  _w: number;
  _h: number;
  log: log.Logger;

  constructor(initialImageData: ImageData) {
    this._imageData = initialImageData;
    this._w = initialImageData.width;
    this._h = initialImageData.height;

    this.log = log.getLogger("Map");
    this.log.setLevel("debug");
    this._mapData = new Array(this._w * this._h);
    for (let i = 0; i < this._w * this._h; i++) {
      this._mapData[i] = { isEdge: false };
    }
    getEdgePixelData(this._imageData, this._mapData);
  }

  // drawing-related functions

  getImageData = () => {
    return this._imageData;
  };

  getMapData = () => {
    return this._mapData;
  };

  // collision-related functions

  mapDataAt = (x: number, y: number) => {
    if (x < 0 || x >= this._w || y < 0 || y >= this._h) {
      return edge;
    }
    return this._mapData[y * this._w + x];
  };

  explodeHole = (x0: number, y0: number, radius: number) => {
    for (let y = y0 - radius; y < y0 + radius; y++) {
      for (let x = x0 - radius; x < x0 + radius; x++) {
        const xw = (x0 - x) * (x0 - x);
        const yw = (y0 - y) * (y0 - y);
        if (xw + yw <= radius * radius) {
          this._imageData.data[y * 4 * this._w + x * 4 + A] = 0;
        }
      }
    }
    // TODO: can restrict this to just the area that we've changed
    getEdgePixelData(this._imageData, this._mapData);
  };
}

export interface PixelData {
  isEdge: boolean;
}
