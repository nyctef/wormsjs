TODO next (?):

- rectangle player collision instead of single pixel? At least to not fall into a gap of only a single pixel
- show player aiming line and spacebar to destroy circle in line of sight


other ideas:

- pull out edgepixeldata into another class
- try to recompute edgepixeldata as little as possible
- climbing/jumping/falling for Player - pull out state machine
- click to make holes, update edgepixeldata and test climbing
- shortcuts for options (eg toggleDrawEdgePixelData())
- https://github.com/jaxbot/browserlink.vim

Pathfinding: 

- Global search eg can I get here by walking / using a rope / teleport /etc
- Then local search how do I walk / jump / rope to x
  -use astar with inputs for choices being basic inputs? Eg hold right or tap space button or execute series of moves over time eg double jump
  -https://www.reddit.com/r/gamedev/comments/2dgew2/2d_platform_ai_pathfinding_how_would_you_do_it/cjpt7yc
- Build navmesh for level and then update as stuff gets destroyed 
- http://www.gamasutra.com/blogs/YoannPignole/20150427/241995/The_Hobbyist_Coder_3__2D_platformers_pathfinding__part_12.php
- https://github.com/jumoel/mario-astar-robinbaumgarten

Bazooka AI idea:

- For each enemy player
- Sample x (20?) bazooka shots that would hit that player
- See if the source positions for those shots are reachable by path finding
- Choose 'easiest' shot?
- Once shot is decided, add random variation based on AI skill
- vary different elements according to how hard they would be for a human to estimate (eg wind speed is probably the most variable factor, and direction the least variable?)

other notes:

- or create a basic worms-like (bazookas only to start?) and experiment with pathfinding, voxel scenery etc
- http://gamedevelopment.tutsplus.com/tutorials/coding-destructible-pixel-terrain-how-to-make-everything-explode--gamedev-45
- experiment with live-coding:
  - http://pythoncentral.io/embed-interactive-python-interpreter-console/
  - http://stackoverflow.com/questions/5597836/how-can-i-embedcreate-an-interactive-python-shell-in-my-python-program
  - log all typed commands so we can save stuff for later
  - immutable game state with history bookmarks / time rewinding
- experiment with pathfinding - challenge: rope-swinging AI
- physics stuff:
  - http://gamedev.stackexchange.com/questions/1589/when-should-i-use-a-fixed-or-variable-time-step
  - http://stackoverflow.com/questions/153507/calculate-the-position-of-an-accelerating-body-after-a-certain-time
  - http://stackoverflow.com/questions/8555470/variable-timesteps-and-gravity-friction
- canvas zoom:
  - http://jsfiddle.net/namuol/VAXrL/1459/ and http://stackoverflow.com/questions/7615009/disable-interpolation-when-scaling-a-canvas

perf notes:

- http://jsperf.com/canvas-pixel-manipulation/30 - maybe use 32bit views on pixel data rather than 8bit ones
- https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
- http://blog.getify.com/sanity-check-object-creation-performance/

entity-component systems:

- http://www.chris-granger.com/2012/12/11/anatomy-of-a-knockout/
- http://gamedev.stackexchange.com/questions/66786/how-to-benefit-from-cpu-cache-in-a-entity-component-system-game-engine
- http://gameprogrammingpatterns.com/data-locality.html
- http://gamesfromwithin.com/data-oriented-design
- http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013

One other advantage: VelocitySystem is actually unit-testable in a way that the code was never testable before pulling it out as a system - would be good to try and TDD through the bugs still left in there

