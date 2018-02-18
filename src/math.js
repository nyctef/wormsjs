function Point(x, y) {
  this.x = x;
  this.y = y;
}

var noop = () => {};

function castLine(predicate, x0, y0, x1, y1, doLog = noop) {
  // based on drawLine/Bresenham's - iterate along the line and stop if we see an edge
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;

  while (true) {
    doLog(`castLine: checking predicate at ${x0},${y0}`);
    if (predicate(x0, y0)) {
      doLog(`castLine: predicate returned true at ${x0},${y0}`);
      return new Point(x0, y0);
    }

    if (x0 == x1 && y0 == y1) {
      doLog(`castLine: reached end of the line at ${x0},${y0}`);
      return null;
    }
    var e2 = 2 * err;
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

export { castLine };
