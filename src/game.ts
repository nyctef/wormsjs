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
    game: Game;
  }
}

const keyboard = new Keyboard(window);

window.game = (function() {
  const mapCanvas = document.getElementById("canvas-map") as HTMLCanvasElement;
  const mapScreen = new Screen(mapCanvas);
  const spritesCanvas = document.getElementById(
    "canvas-sprites"
  ) as HTMLCanvasElement;
  const spritesScreen = new Screen(spritesCanvas);

  const game = {} as Game;
  game.log = log.getLogger("game");

  game.size = { x: mapCanvas.width, y: mapCanvas.height };

  log.debug(`game size: ${game.size.x},${game.size.y}`);

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  const player = Player(0, 0);
  mapScreen.drawRect(0, 15, 100, 1, "black");
  mapScreen.drawRect(0, 30, 100, 1, "black");
  mapScreen.drawRect(20, 14, 2, 2, "black");
  mapScreen.drawRect(30, 13, 3, 3, "black");
  mapScreen.drawRect(40, 12, 4, 4, "black");
  mapScreen.drawRect(50, 10, 5, 5, "black");

  game.map = new Map(mapScreen.getImageData());

  game.options = {
    drawEdgePixelData: true
  };

  const velocitySystem = new VelocitySystem();
  const playerControlSystem = PlayerControlSystem;
  const drawingSystem = DrawingSystem;

  function update() {
    velocitySystem.start_frame();

    updateKeyboard(keyboard, player);
    playerControlSystem.update(player);
    velocitySystem.set_move_plan(player);
    velocitySystem.check_collisions(game.map, player);
    velocitySystem.apply_move_plan(player);
  }

  function redrawMap() {
    mapScreen.putImageData(game.map.getImageData());
  }
  redrawMap();

  function draw() {
    spritesScreen.clear();
    drawingSystem.drawDebugData(spritesScreen, game.options, game.map);

    drawingSystem.draw(spritesScreen, player);
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
    const x = clickEvent.pageX - this.offsetLeft;
    const y = clickEvent.pageY - this.offsetTop;
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
})();
