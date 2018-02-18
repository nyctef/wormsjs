import { Entity } from "./entity";
import { PixelData } from "./map";
import Screen from "./screen";

interface MapThingy {
  data: number[];
  width: number;
}

const setPixel = function(
  target: MapThingy,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  target.data[y * target.width * 4 + x * 4] = r;
  target.data[y * target.width * 4 + x * 4 + 1] = g;
  target.data[y * target.width * 4 + x * 4 + 2] = b;
  target.data[y * target.width * 4 + x * 4 + 3] = a;
};

const drawLine = function(
  target: MapThingy,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
  // http://stackoverflow.com/a/4672319/895407
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    setPixel(target, x0, y0, 255, 0, 0, 255);

    if (x0 === x1 && y0 === y1) {
      break;
    }
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
};

const DrawingSystem = {
  draw: function(screen: Screen, entity: Entity) {
    const appearance = entity.appearance;
    const position = entity.position;
    if (!appearance || !position) {
      return;
    }
    if (appearance.type === "rectangle") {
      const data = appearance.data;
      screen.drawRect(
        position.x,
        position.y,
        data.rect.height,
        data.rect.width,
        data.rect.color
      );
    } else if (appearance.type === "shape") {
      const size = appearance.data.size;
      const shape = appearance.data.shape;
      const color = appearance.data.color;
      for (let x = 0; x < size.width; x++) {
        for (let y = 0; y < size.height; y++) {
          if (shape[y * size.width + x]) {
            screen.drawPixel(position.x + x, position.y + y, color);
          }
        }
      }
    } else {
      throw "appearance not handled";
    }
  },

  drawDebugData: function(screen: Screen, options: any, map: any) {
    if (options.drawEdgePixelData) {
      this.drawIsEdge(screen, map.getMapData());
    }
  },

  drawIsEdge: function(screen: Screen, mapData: PixelData[]) {
    const width = screen._width;
    for (let i = 0; i < mapData.length; i++) {
      if (mapData[i].isEdge) {
        screen.drawPixel(i % width, Math.round(i / width), "red");
      }
    }
  }
};

export { DrawingSystem };
