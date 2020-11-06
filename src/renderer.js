let totalRowBoxes = 14;
let gameBoard;
let snakes = [];
let manager = null;
let currentSnake = null;

function update(loopIndex) {
  currentSnake = snakes[loopIndex.index];
  currentSnake.frames++;
  console.log(`Snake: %c${currentSnake.frames}`, `color: ${currentSnake.color}`);
  
  if (gameBoard.isGameEnded(currentSnake.bodies, loopIndex)) {
    gameBoard.endGame(loopIndex);
    currentSnake.canvas.parentNode.querySelector("#gameEnded").style.display = "";
    return;
  }
  
  for (let [ index, food ] of currentSnake.foods.entries()) {
    if (food.x === currentSnake.bodies[0].x && food.y === currentSnake.bodies[0].y) {
      currentSnake.canvas.parentNode
          .querySelector(".score").firstChild
          .textContent = "Score: " + ++currentSnake.score; 
  
      currentSnake.bodies.unshift({
        x: currentSnake.bodies[0].x,
        y: currentSnake.bodies[0].y,
        invisible: false
      });
      let newFood = manager.getRandomAvailableLocation(
        currentSnake.bodies, gameBoard.boxSize
      );
      currentSnake.foods.splice(index, 1, {
        x: newFood.x,
        y: newFood.y
      });
    }
  }
  
  gameBoard.character(currentSnake.bodies, loopIndex);
  gameBoard.drawFoods(currentSnake.foods, loopIndex);
  gameBoard.drawMapPart(gameBoard.moveSnake(currentSnake, loopIndex), loopIndex);
  
  if (!currentSnake.pressQueue.length) {
    for (let move of aStar.search(currentSnake, manager.wholeMap)) {
      currentSnake.pressQueue.push(
        pressHandler({ key: move }, currentSnake.direction)
      );
    }
  }
  
  // When snake gets near the walls. Activates with threshold
  gameBoard.checkNearBorder(manager.boarders, currentSnake, currentSnake.threshold);
  
  currentSnake.direction = currentSnake.pressQueue.shift() || currentSnake.direction;
  
  // gameBoard.endGame(loopIndex);
  
  // TODO: 
  // 1. Disallow move backword
  // 2. Remove this snakes invisible body
  // 3. Recreate this update function (cuz it is trash)
}

function eventHandlers() {
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      for (let loop of gameBoard.loopIds) { gameBoard.endGame(loop); }
    }
    else if (event.key === "§") {
      aStar.search(currentSnake, manager.wholeMap);
    }
  });
  document.querySelector("#trying").addEventListener("click", () => {
    manager.reInit(snakes, snakeObjects, gameBoard);
    runOnLoad();
  });
}

const runOnLoad = function () {
  manager.gameBoard = gameBoard = new boardProps(totalRowBoxes);
  snakes = manager.populate(gameBoard.canvas.length, snakeObjects, gameBoard);
  for (let snake of snakes) { manager.spawnFood(snake); }
  
  gameBoard.startGame();
}