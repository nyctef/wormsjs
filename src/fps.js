import log from "loglevel";
var fpsLog = log.getLogger("fps");

// set up an fps counter
var countFrame = (function() {
  var lastFrameStartTime = performance.now();
  var frameCountStartTime = performance.now();
  var frameCount = 0;

  function logFps() {
    var now = performance.now();
    var diffMs = now - frameCountStartTime;
    var diffSecs = diffMs / 1000;
    fpsLog.info("fps: " + (frameCount / diffSecs).toFixed(2));

    frameCountStartTime = now;
    frameCount = 0;
  }

  function countFrame() {
    var thisFrameStartTime = performance.now();
    var tdelta = thisFrameStartTime - lastFrameStartTime;
    lastFrameStartTime = thisFrameStartTime;
    frameCount++;
    return tdelta;
  }

  setInterval(logFps, 5 * 1000);

  return countFrame;
})();

export default countFrame;
