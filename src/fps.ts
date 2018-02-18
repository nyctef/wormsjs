import * as log from "loglevel";
const fpsLog = log.getLogger("fps");

// set up an fps counter
export const countFrame = (function() {
  let lastFrameStartTime = performance.now();
  let frameCountStartTime = performance.now();
  let frameCount = 0;

  function logFps() {
    const now = performance.now();
    const diffMs = now - frameCountStartTime;
    const diffSecs = diffMs / 1000;
    fpsLog.info("fps: " + (frameCount / diffSecs).toFixed(2));

    frameCountStartTime = now;
    frameCount = 0;
  }

  function countFrame() {
    const thisFrameStartTime = performance.now();
    const tdelta = thisFrameStartTime - lastFrameStartTime;
    lastFrameStartTime = thisFrameStartTime;
    frameCount++;
    return tdelta;
  }

  setInterval(logFps, 5 * 1000);

  return countFrame;
})();
