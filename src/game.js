"use strict"
import Screen from './screen'
import KeyboardInputSystem from './keyboard-input-system'
import VelocitySystem from './velocity-system'
import PlayerControlSystem from './player-control-system'
import * as d from './drawing'
import Player from './player'
import countFrame from './fps'
import Map from './map'

import log from 'loglevel'

if (!window.canvas) {
  (function initCanvas() {
    var body = document.getElementsByTagName("body")[0];
    while (body.hasChildNodes()) {
      body.removeChild(body.lastChild);
    }

    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;

    body.appendChild(canvas)

    window.canvas = canvas
    window.screen = new Screen(canvas)

    window.pixeldata = {}
    window.pixeldata.map = new Map(window.screen.getImageData())
    window.pixeldata.mapRender = window.screen.createImageData()
  })()
}

if (!window.game_state) {
  (function initGameState() {
    window.game_state = {}
    window.game_state.player = new Player()
    window.game_state.vs_state = {}
  })()
}

function makeGame() {
  //console.log('makeGame')

  var screen = window.screen

  var game = {}
  game.log = log.getLogger('game')

  game.size = { x: canvas.width, y: canvas.height }

  log.debug(`game size: ${game.size.x},${game.size.y}`)

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  var player = window.game_state.player
  screen.drawRect(0,  15, 100, 1, 'black')
  screen.drawRect(20, 14, 2, 2, 'black')
  screen.drawRect(30, 13, 3, 3, 'black')
  screen.drawRect(40, 12, 4, 4, 'black')
  screen.drawRect(50, 10, 5, 5, 'black')
  player.position.x = 0
  player.position.y = 0

  game.options = {
    drawEdgePixelData: true,
  }
  var game_state = window.game_state

  var keyboardInputSystem = new KeyboardInputSystem()
  var velocitySystem = new VelocitySystem(game_state.vs_state)
  var playerControlSystem = new PlayerControlSystem()
  var drawingSystem = new d.DrawingSystem()

  function update() {
    velocitySystem.start_frame(game)

    keyboardInputSystem.update(game, player)
    playerControlSystem.update(game, player)
    velocitySystem.set_move_plan(game, player)
    velocitySystem.check_collisions(game.map, player)
    velocitySystem.apply_move_plan(game, player)
  }

  game.map = window.pixeldata.map

  function draw() {
    // copy map background into mapRender
    window.pixeldata.mapRender.data.set(window.pixeldata.map.getImageData().data)

    screen.putImageData(window.pixeldata.mapRender)

    drawingSystem.drawDebugData(screen, game)
    drawingSystem.draw(screen, player)
  }

  // define main game loop
  game.loop = function() {
    /*var tdelta = */countFrame()

    update()
    draw()
   
    if (window.game === game) {
      // if we haven't been reloaded, register for the next frame
      window.requestAnimationFrame(game.loop)
    }
    //window.setTimeout(game.loop, 0)
  }

  game.onCanvasClick = function(clickEvent) {
    log.debug(clickEvent)
    var x = clickEvent.pageX - canvas.offsetLeft
    var y = clickEvent.pageY - canvas.offsetTop
    var mx = Math.round(x * canvas.width / canvas.offsetWidth)
    var my = Math.round(y * canvas.height / canvas.offsetHeight)
    log.debug(`registered click at ${x},${y} (${mx},${my})`)
    window.game.map.explodeHole(mx, my, 10)
  }

  canvas.addEventListener('click', game.onCanvasClick)

  game.dispose = function() {
    canvas.removeEventListener('click', game.onCanvasClick)
  }

  // start the game running
  game.loop()

  log.info(game)
  return game
}

if (window.game) {
  window.game.dispose()
}
window.game = makeGame()

if (!window.has_reload) {
  window.has_reload = true
  window.setInterval(window.reload, 250)
}
