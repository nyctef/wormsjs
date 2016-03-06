"use strict"
import Screen from './screen'
import * as c from './behaviours'
import Player from './player'
import countFrame from './fps'
import Map from './map'

window.game = (function() {

  var canvas = document.getElementById('screen')
  var canvasParent = canvas.parentNode
  var screen = new Screen(canvas)

  var game = {}

  game.size = { x: canvas.width, y: canvas.height }

  console.log(game.size)

  // define some starting geometry
  // TODO: move this onto Map functions? or maybe a separate LoadMap thing?
  screen.drawRect(5, 5, 100, 100, 'black')
  screen.eraseCircle(50, 50, 25)

  game.map = new Map(screen.getImageData())
  game.mapRender = screen.createImageData()

  var player = new Player(game)

  game.options = {
    drawEdgePixelData: true
  }

  var keyboardInputSystem = new c.KeyboardInputSystem()
  var velocitySystem = new c.VelocitySystem()
  var playerControlSystem = new c.PlayerControlSystem()

  function update() {
    velocitySystem.start_frame(game)

    keyboardInputSystem.update(game, player)
    playerControlSystem.update(game, player)
    velocitySystem.set_move_plan(game, player)
    velocitySystem.check_collisions(game, player)
    velocitySystem.apply_move_plan(game, player)
  }

  function drawIsEdge(mapData, mapRender) {
    for (var i=0; i< mapData.length; i++) {
      if (mapData[i].isEdge) {
        mapRender.data[(i*4)+0] = 255
        mapRender.data[(i*4)+3] = 255
      }
    }
  }

  function setPixel(target, x, y, r, g, b, a) {
      target.data[(y*target.width*4)+x*4] = r
      target.data[(y*target.width*4)+x*4+1] = g
      target.data[(y*target.width*4)+x*4+2] = b
      target.data[(y*target.width*4)+x*4+3] = a
  }

  function drawLine(target, x0, y0, x1, y1) {
    // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    // http://stackoverflow.com/a/4672319/895407
    var dx = Math.abs(x1-x0)
    var dy = Math.abs(y1-y0)
    var sx = (x0 < x1) ? 1 : -1
    var sy = (y0 < y1) ? 1 : -1
    var err = dx-dy

    while(true) {
      setPixel(target, x0, y0, 255, 0, 0, 255)

      if ((x0==x1) && (y0==y1)) break
      var e2 = 2*err
      if (e2 >-dy){ err -= dy; x0  += sx }
      if (e2 < dx){ err += dx; y0  += sy }
    }
  }

  function draw() {
    // copy map background into mapRender
    game.mapRender.data.set(game.map.getImageData().data)

    if (game.options.drawEdgePixelData) {
      drawIsEdge(game.map.getMapData(), game.mapRender)
    }

    screen.putImageData(game.mapRender)
    player.draw(screen)
  }

  // define main game loop
  game.loop = function() {
    var tdelta = countFrame()

    update()
    draw()
    
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

  // start the game running
  game.loop()

  console.log(game)
  return game
})()
