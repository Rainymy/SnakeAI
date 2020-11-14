let totalRowBoxes = 18;
let gameBoard;
let snakes = [];
let manager = null;
let currentSnake = null;

function update(loopIndex) {
  let { bodies, foods, canvas, color, score } = currentSnake = snakes[loopIndex.index];
  console.log(`Snake: %c${++currentSnake.frames}`, `color: ${color}`);
  
  if (gameBoard.isGameEnded(bodies, loopIndex)) {
    canvas.parentNode.querySelector("#gameEnded").style.display = "";
    return gameBoard.endGame(loopIndex);
  }
  
  for (let [ index, food ] of foods.entries()) {
    if (food.x === bodies[0].x && food.y === bodies[0].y) {
      canvas.parentNode.querySelector(".score").firstChild
          .textContent = `Score: ${++currentSnake.score}`;
      
      bodies.unshift({ x: bodies[0].x, y: bodies[0].y, invisible: false });
      let newFood = manager.getRandomAvailableLocation(bodies, gameBoard.boxSize);
      foods.splice(index, 1, { x: newFood.x, y: newFood.y });
    }
  }
  
  gameBoard.character(bodies, loopIndex);
  gameBoard.drawFoods(foods, loopIndex);
  gameBoard.drawMapPart(currentSnake.moveSnake(), loopIndex);
  
  if (!currentSnake.pressQueue.length) {
    for (let move of aStar.search(currentSnake, manager.wholeMap, totalRowBoxes)) {
      currentSnake.pressQueue.push(currentSnake.pressHandler( move ));
    }
  }
  
  // When snake gets near the walls. Activates with threshold
  gameBoard.checkNearBorder(manager.boarders, currentSnake, currentSnake.threshold);
  
  currentSnake.direction = currentSnake.getNextDirection();
}

function eventHandlers() {
  document.body.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      for (let loop of gameBoard.loopIds) gameBoard.endGame(loop);
    }
    else if (event.key === "§") aStar.search(currentSnake, manager.wholeMap);
  });
  document.querySelector("#trying").addEventListener("click", function () {
    manager.reInit(snakes, snakeObjects);
    runOnLoad();
  });
}

const runOnLoad = function () {
  manager.gameBoard = gameBoard = new boardProps(totalRowBoxes);
  snakes = manager.populate(snakeObjects);
  for (let snake of snakes) snake.spawnFood(manager.getRandomLocations(snake.bodies));
  
  gameBoard.startGame();
}