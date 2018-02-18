class Screen {
  _ctx: CanvasRenderingContext2D;
  _width: number;
  _height: number;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw "failed to get 2d context";
    }
    this._ctx = ctx;
    this._width = canvas.width;
    this._height = canvas.height;
  }

  getImageData = () => {
    return this._ctx.getImageData(0, 0, this._width, this._height);
  };

  createImageData = () => {
    return this._ctx.createImageData(this._width, this._height);
  };

  drawCircle = (
    centerX: number,
    centerY: number,
    radius: number,
    fillStyle: string
  ) => {
    fillStyle = fillStyle || "green";
    this._ctx.beginPath();
    this._ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = fillStyle;
    this._ctx.fill();
  };

  eraseCircle = (centerX: number, centerY: number, radius: number) => {
    this._ctx.save();
    this._ctx.globalCompositeOperation = "destination-out";
    this.drawCircle(centerX, centerY, radius, "rgba(0,0,0,1)");
    this._ctx.restore();
  };

  drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fillStyle: string
  ) => {
    fillStyle = fillStyle || "black";
    this._ctx.fillStyle = fillStyle;
    this._ctx.fillRect(x, y, w, h);
  };

  drawPixel = (x: number, y: number, fillStyle: string) => {
    this.drawRect(x, y, 1, 1, fillStyle);
  };

  putImageData = (data: ImageData) => {
    this._ctx.putImageData(data, 0, 0);
  };
}

export default Screen;
