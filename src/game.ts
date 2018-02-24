import { DrawingSystem } from "./drawing-system";
import { countFrame } from "./fps";
import { Game } from "./game-types";
import { Keyboard } from "./keyboard";
import { updateKeyboard } from "./keyboard-input-system";
import { Map } from "./map";
import { Player } from "./player";
import { PlayerControlSystem } from "./player-control-system";
import { Screen } from "./screen";
import { VelocitySystem } from "./velocity-system";

import * as log from "loglevel";

declare global {
  interface Window {
    buildGame: () => Game;
    setLogLevel: (level: log.LogLevelDesc) => void;
  }
}

const keyboard = new Keyboard(window);

function createCanvas(
  width: number,
  height: number,
  suffix: string,
  zIndex: number
) {
  const template = document.createElement("template");
  template.innerHTML = `<canvas id='canvas-${suffix}' width=${width} height=${height} style="z-index:${suffix}"></canvas>`;
  return template.content.firstChild as HTMLCanvasElement;
}

function createCanvases(width: number, height: number) {
  const canvasesArea = document.getElementById("canvases") as HTMLDivElement;
  while (canvasesArea.lastChild) {
    canvasesArea.removeChild(canvasesArea.lastChild);
  }

  const mapCanvas = createCanvas(width, height, "map", 0);
  canvasesArea.appendChild(mapCanvas);
  const mapScreen = new Screen(mapCanvas);

  const spritesCanvas = createCanvas(width, height, "sprites", 1);
  canvasesArea.appendChild(spritesCanvas);
  const spritesScreen = new Screen(spritesCanvas);

  return { mapScreen, spritesScreen, spritesCanvas };
}

function buildClimbingTest() {
  const width = 400;
  const height = 300;
  const { mapScreen, spritesScreen, spritesCanvas } = createCanvases(
    width,
    height
  );

  const game = {} as Game;
  game.log = log.getLogger("game");

  log.debug(`game size: ${width},${height}`);

  const player = Player(0, 0);
  const entities = [{}, player];

  // define some starting geometry
  mapScreen.drawRect(0, 15, 100, 1, "black");
  mapScreen.drawRect(0, 30, 100, 1, "black");
  mapScreen.drawRect(20, 14, 2, 2, "black");
  mapScreen.drawRect(30, 13, 3, 3, "black");
  mapScreen.drawRect(40, 12, 4, 4, "black");
  mapScreen.drawRect(50, 10, 5, 5, "black");

  return { game, entities, mapScreen, spritesScreen, spritesCanvas };
}

window.buildGame = function() {
  const {
    game,
    entities,
    mapScreen,
    spritesScreen,
    spritesCanvas
  } = buildClimbingTest();

  game.map = new Map(mapScreen.getImageData());

  game.options = {
    drawEdgePixelData: true
  };

  const velocitySystem = new VelocitySystem(log);
  const playerControlSystem = PlayerControlSystem;
  const drawingSystem = DrawingSystem;

  function update() {
    velocitySystem.start_frame();

    for (const entity of entities) {
      updateKeyboard(keyboard, entity);
      playerControlSystem.update(entity);
      velocitySystem.set_move_plan(entity);
      velocitySystem.check_collisions(game.map, entity);
      velocitySystem.apply_move_plan(entity);
    }
  }

  function redrawMap() {
    mapScreen.putImageData(game.map.getImageData());
  }
  redrawMap();

  function draw() {
    spritesScreen.clear();
    drawingSystem.drawDebugData(spritesScreen, game.options, game.map);

    for (const entity of entities) {
      drawingSystem.draw(spritesScreen, entity);
    }
  }

  // define main game loop
  function loop() {
    /*var tdelta = */ countFrame();

    update();
    draw();

    window.requestAnimationFrame(loop);
  }

  spritesCanvas.addEventListener("click", function(clickEvent) {
    log.debug(clickEvent);
    const x = clickEvent.offsetX;
    const y = clickEvent.offsetY;
    const mx = Math.round(x * this.width / this.offsetWidth);
    const my = Math.round(y * this.height / this.offsetHeight);
    log.debug(`registered click at ${x},${y} (${mx},${my})`);
    game.map.explodeHole(mx, my, 10);
    redrawMap();
  });

  // start the game running
  loop();

  log.info(game);
  return game;
};

window.setLogLevel = (level: log.LogLevelDesc) => {
  log.setLevel(level);
};

window.buildGame();
