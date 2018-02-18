var Screen = function(canvas) {
  this.ctx = canvas.getContext("2d");
  this.width = canvas.width;
  this.height = canvas.height;

  this.getImageData = function() {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  };

  this.createImageData = function() {
    return this.ctx.createImageData(this.width, this.height);
  };

  this.drawCircle = function(centerX, centerY, radius, fillStyle) {
    fillStyle = fillStyle || "green";
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
  };

  this.eraseCircle = function(centerX, centerY, radius) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-out";
    this.drawCircle(centerX, centerY, radius, "rgba(0,0,0,1)");
    this.ctx.restore();
  };

  this.drawRect = function(x, y, w, h, fillStyle) {
    fillStyle = fillStyle || "black";
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x, y, w, h);
  };

  this.drawPixel = function(x, y, fillStyle) {
    this.drawRect(x, y, 1, 1, fillStyle);
  };

  this.putImageData = function(data) {
    this.ctx.putImageData(data, 0, 0);
  };
};

export default Screen;
