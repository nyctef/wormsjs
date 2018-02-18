Pathfinding:

* Global search eg can I get here by walking / using a rope / teleport /etc
* Then local search how do I walk / jump / rope to x
  -use astar with inputs for choices being basic inputs? Eg hold right or tap space button or execute series of moves over time eg double jump -https://www.reddit.com/r/gamedev/comments/2dgew2/2d_platform_ai_pathfinding_how_would_you_do_it/cjpt7yc
* Build navmesh for level and then update as stuff gets destroyed
* http://www.gamasutra.com/blogs/YoannPignole/20150427/241995/The_Hobbyist_Coder_3__2D_platformers_pathfinding__part_12.php
* https://github.com/jumoel/mario-astar-robinbaumgarten
* http://bitsquid.blogspot.co.uk/2010/10/is-overrated.html

Bazooka AI idea:

* For each enemy player
* Sample x (20?) bazooka shots that would hit that player
* See if the source positions for those shots are reachable by path finding
* Choose 'easiest' shot?
* Once shot is decided, add random variation based on AI skill
* vary different elements according to how hard they would be for a human to estimate (eg wind speed is probably the most variable factor, and direction the least variable?)

other notes:

* or create a basic worms-like (bazookas only to start?) and experiment with pathfinding, voxel scenery etc
* http://gamedevelopment.tutsplus.com/tutorials/coding-destructible-pixel-terrain-how-to-make-everything-explode--gamedev-45
* experiment with live-coding:
  * http://pythoncentral.io/embed-interactive-python-interpreter-console/
  * http://stackoverflow.com/questions/5597836/how-can-i-embedcreate-an-interactive-python-shell-in-my-python-program
  * log all typed commands so we can save stuff for later
  * immutable game state with history bookmarks / time rewinding
* experiment with pathfinding - challenge: rope-swinging AI
* physics stuff:
  * http://gamedev.stackexchange.com/questions/1589/when-should-i-use-a-fixed-or-variable-time-step
  * http://stackoverflow.com/questions/153507/calculate-the-position-of-an-accelerating-body-after-a-certain-time
  * http://stackoverflow.com/questions/8555470/variable-timesteps-and-gravity-friction
* canvas zoom:
  * http://jsfiddle.net/namuol/VAXrL/1459/ and http://stackoverflow.com/questions/7615009/disable-interpolation-when-scaling-a-canvas
* map generation:
  * http://gamedev.stackexchange.com/questions/20588/how-can-i-generate-worms-style-terrain
* collision (getting surface normals):
  * http://gamedev.stackexchange.com/questions/2853/how-do-i-calculate-the-angle-of-the-slope-at-a-point-on-a-2d-bitmap-terrain
* lightweight live reloading:
  * http://bitsquid.blogspot.co.uk/2016/01/hot-reloadable-javascript-batman.html
    perf notes:
* rope "physics":

  * http://gamedev.stackexchange.com/questions/558/implementing-a-wrapping-wire-like-the-worms-ninja-rope-in-a-2d-physics-engine

* http://jsperf.com/canvas-pixel-manipulation/30 - maybe use 32bit views on pixel data rather than 8bit ones
* https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
* http://blog.getify.com/sanity-check-object-creation-performance/
* http://www.gamasutra.com/view/news/207954/Vlambeer_cofounder_shares_advice_on_building_better_action_games.php

entity-component systems:

* http://www.chris-granger.com/2012/12/11/anatomy-of-a-knockout/
* http://gamedev.stackexchange.com/questions/66786/how-to-benefit-from-cpu-cache-in-a-entity-component-system-game-engine
* http://gameprogrammingpatterns.com/data-locality.html
* http://gamesfromwithin.com/data-oriented-design
* http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013 \_x
* performance: http://t-machine.org/index.php/2014/03/08/data-structures-for-entity-systems-contiguous-memory/
* parent/child relationships:
  * https://mtnphil.wordpress.com/2014/06/09/managing-game-object-hierarchy-in-an-entity-component-system/
  * http://gamedev.stackexchange.com/questions/31888/in-an-entity-component-system-engine-how-do-i-deal-with-groups-of-dependent-ent
* top-level APIs: http://bitsquid.blogspot.co.uk/2014/08/building-data-oriented-entity-system.html
  * notably encapsulating the entity-component relationships inside the actual component managers rather than having the lists-of-components as a top-level thing

One other advantage: VelocitySystem is actually unit-testable in a way that the code was never testable before pulling it out as a system - would be good to try and TDD through the bugs still left in there
