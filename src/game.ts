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
import { DrawingSystem } from "./drawing";

declare global {
  interface Window {
    game: Game;
  }
}

const keyboard = new Keyboard(window);

window.game = (function() {
  const canvas = document.getElementById("screen") as HTMLCanvasElement;
  const screen = new Screen(canvas);

  const game = {} as Game;
  if (!screen) {
    throw "x";
  }
  game.log = log.getLogger("game");

  game.size = { x: canvas.width, y: canvas.height };

  log.debug(`game size: ${game.size.x},${game.size.y}`);

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  const player = Player(0, 0);
  screen.drawRect(0, 15, 100, 1, "black");
  screen.drawRect(20, 14, 2, 2, "black");
  screen.drawRect(30, 13, 3, 3, "black");
  screen.drawRect(40, 12, 4, 4, "black");
  screen.drawRect(50, 10, 5, 5, "black");

  game.map = new Map(screen.getImageData());
  game.mapRender = screen.createImageData();

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

  function draw() {
    // copy map background into mapRender
    game.mapRender.data.set(game.map.getImageData().data);

    screen.putImageData(game.mapRender);

    drawingSystem.drawDebugData(screen, game.options, game.map);

    drawingSystem.draw(screen, player);
  }

  // define main game loop
  function loop() {
    /*var tdelta = */ countFrame();

    update();
    draw();

    window.requestAnimationFrame(loop);
  }

  canvas.addEventListener("click", clickEvent => {
    log.debug(clickEvent);
    const x = clickEvent.pageX - canvas.offsetLeft;
    const y = clickEvent.pageY - canvas.offsetTop;
    const mx = Math.round(x * canvas.width / canvas.offsetWidth);
    const my = Math.round(y * canvas.height / canvas.offsetHeight);
    log.debug(`registered click at ${x},${y} (${mx},${my})`);
    game.map.explodeHole(mx, my, 10);
  });

  // start the game running
  loop();

  log.info(game);
  return game;
})();
