"use strict"
import Screen from './screen'
import * as c from './behaviours'
import * as d from './drawing'
import Player from './player'
import countFrame from './fps'
import Map from './map'
import Keyboard from './keyboard'

window.game = (function() {

  var canvas = document.getElementById('screen')
  var canvasParent = canvas.parentNode
  var screen = new Screen(canvas)

  var game = {}

  game.size = { x: canvas.width, y: canvas.height }

  console.log(game.size)

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  var player = new Player()
  screen.drawRect(0, 10, 100, 1, 'black')
  screen.drawRect(20, 9, 2, 2, 'black')
  screen.drawRect(30, 8, 3, 3, 'black')
  screen.drawRect(40, 7, 4, 4, 'black')
  screen.drawRect(50, 5, 5, 5, 'black')
  player.position.x = 0
  player.position.y = 0

  game.map = new Map(screen.getImageData())
  game.mapRender = screen.createImageData()


  game.options = {
    drawEdgePixelData: true,
    paused: false,
  }

  var keyboardInputSystem = new c.KeyboardInputSystem()
  var velocitySystem = new c.VelocitySystem()
  var playerControlSystem = new c.PlayerControlSystem()
  var drawingSystem = new d.DrawingSystem()

  function update() {
    velocitySystem.start_frame(game)

    keyboardInputSystem.update(game, player)
    playerControlSystem.update(game, player)
    velocitySystem.set_move_plan(game, player)
    velocitySystem.check_collisions(game, player)
    velocitySystem.apply_move_plan(game, player)
  }


  function draw() {
    // copy map background into mapRender
    game.mapRender.data.set(game.map.getImageData().data)

    screen.putImageData(game.mapRender)

    drawingSystem.drawDebugData(screen, game)
    drawingSystem.draw(screen, player)
  }

  // define main game loop
  game.loop = function() {
    if (!game.options.paused) {
      var tdelta = countFrame()

      update()
      draw()
    }
    
    window.requestAnimationFrame(game.loop)
    //window.setTimeout(game.loop, 0)
  }

  canvas.addEventListener('click', function(clickEvent) {
    console.log(clickEvent)
    var x = clickEvent.pageX - canvas.offsetLeft
    var y = clickEvent.pageY - canvas.offsetTop
    var mx = Math.round(x * canvas.width / canvas.offsetWidth)
    var my = Math.round(y * canvas.height / canvas.offsetHeight)
    console.log(`registered click at ${x},${y} (${mx},${my})`)
    game.map.explodeHole(mx, my, 10)
  })

  new Keyboard().addKeyUpHandler(function(key) {
    if (key == Keyboard.Keys.P) {
      game.options.paused = !game.options.paused
    }
  })

  // start the game running
  game.loop()

  console.log(game)
  return game
})()
