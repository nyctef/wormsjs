interface Point {
  x: number;
  y: number;
}

const noop = () => {};

export function castLine(
  predicate: ((x: number, y: number) => boolean),
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  doLog: ((message: string) => void) = noop
) {
  // based on drawLine/Bresenham's - iterate along the line and stop if we see an edge
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    doLog(`castLine: checking predicate at ${x0},${y0}`);
    if (predicate(x0, y0)) {
      doLog(`castLine: predicate returned true at ${x0},${y0}`);
      return { x: x0, y: y0 };
    }

    if (x0 === x1 && y0 === y1) {
      doLog(`castLine: reached end of the line at ${x0},${y0}`);
      return null;
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
}
