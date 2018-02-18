"use strict";
import Screen from "./screen";
import KeyboardInputSystem from "./keyboard-input-system";
import VelocitySystem from "./velocity-system";
import PlayerControlSystem from "./player-control-system";
import * as d from "./drawing";
import Player from "./player";
import countFrame from "./fps";
import Map from "./map";

import log from "loglevel";

window.game = (function() {
  var canvas = document.getElementById("screen");
  var screen = new Screen(canvas);

  var game = {};
  game.log = log.getLogger("game");

  game.size = { x: canvas.width, y: canvas.height };

  log.debug(`game size: ${game.size.x},${game.size.y}`);

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  var player = new Player();
  screen.drawRect(0, 15, 100, 1, "black");
  screen.drawRect(20, 14, 2, 2, "black");
  screen.drawRect(30, 13, 3, 3, "black");
  screen.drawRect(40, 12, 4, 4, "black");
  screen.drawRect(50, 10, 5, 5, "black");
  player.position.x = 0;
  player.position.y = 0;

  game.map = new Map(screen.getImageData());
  game.mapRender = screen.createImageData();

  game.options = {
    drawEdgePixelData: true
  };

  var keyboardInputSystem = new KeyboardInputSystem();
  var velocitySystem = new VelocitySystem();
  var playerControlSystem = new PlayerControlSystem();
  var drawingSystem = new d.DrawingSystem();

  function update() {
    velocitySystem.start_frame(game);

    keyboardInputSystem.update(game, player);
    playerControlSystem.update(game, player);
    velocitySystem.set_move_plan(game, player);
    velocitySystem.check_collisions(game.map, player);
    velocitySystem.apply_move_plan(game, player);
  }

  function draw() {
    // copy map background into mapRender
    game.mapRender.data.set(game.map.getImageData().data);

    screen.putImageData(game.mapRender);

    drawingSystem.drawDebugData(screen, game);
    drawingSystem.draw(screen, player);
  }

  // define main game loop
  game.loop = function() {
    /*var tdelta = */ countFrame();

    update();
    draw();

    window.requestAnimationFrame(game.loop);
    //window.setTimeout(game.loop, 0)
  };

  canvas.addEventListener("click", function(clickEvent) {
    log.debug(clickEvent);
    var x = clickEvent.pageX - canvas.offsetLeft;
    var y = clickEvent.pageY - canvas.offsetTop;
    var mx = Math.round(x * canvas.width / canvas.offsetWidth);
    var my = Math.round(y * canvas.height / canvas.offsetHeight);
    log.debug(`registered click at ${x},${y} (${mx},${my})`);
    game.map.explodeHole(mx, my, 10);
  });

  // start the game running
  game.loop();

  log.info(game);
  return game;
})();
