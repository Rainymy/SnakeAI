let totalRowBoxes = 25;
let gameBoard;
let snakes = [];
let manager = null;
let currentSnake = null;

function pressHandler(event, loopObj={ index: 0 }) {
  let obj = snakes[loopObj.index];
  if (event.key === "w" && obj.direction.letter !== "s") {
    obj.pressQueue.push({ x: 0, y: -1, letter: "w" });
  }
  else if (event.key === "s" && obj.direction.letter !== "w") {
    obj.pressQueue.push({ x: 0, y: 1, letter: "s" });
  }
  else if (event.key === "d" && obj.direction.letter !== "a") {
    obj.pressQueue.push({ x: 1, y: 0, letter: "d" });
  }
  else if (event.key === "a" && obj.direction.letter !== "d") {
    obj.pressQueue.push({ x: -1, y: 0, letter: "a" });
  }
  return null;
}

function update(loopIndex) {
  currentSnake = snakes[loopIndex.index];
  currentSnake.frames++;
  console.log(`Snake: %c${currentSnake.frames}`, `color: ${currentSnake.color}`);
  // gameBoard.clearScreen(loopIndex);
  // gameBoard.drawMap(loopIndex);
  
  if (gameBoard.isGameEnded(currentSnake.bodies, loopIndex)) {
    gameBoard.endGame(loopIndex);
    // currentSnake.canvas.parentNode.querySelector(".score").textContent += " - Game Over";
    currentSnake.canvas.parentNode.querySelector("#gameEnded").style.display = "";
  }
  for (let [ index, food ] of currentSnake.foods.entries()) {
    if (food.x === currentSnake.bodies[0].x && food.y === currentSnake.bodies[0].y) {
      currentSnake.canvas
          .parentNode.querySelector(".score").childNodes[0]
          .textContent = "Score: " + ++currentSnake.score; 
          
      currentSnake.bodies.unshift({
        x: currentSnake.bodies[0].x,
        y: currentSnake.bodies[0].y,
        invisible: false
      });
      let newFood = currentSnake.getRandomAvailableLocation();
      currentSnake.foods.splice(index, 1, {
        x: newFood.x,
        y: newFood.y
      });
    }
  }
  
  gameBoard.character(currentSnake.bodies, loopIndex);
  gameBoard.drawFoods( currentSnake.foods, loopIndex );
  
  if (currentSnake.pressQueue.length) {
    currentSnake.direction = currentSnake.pressQueue.shift();
  }
  
  gameBoard.drawMapPart(gameBoard.moveSnake(currentSnake, loopIndex), loopIndex);
  // if (gameBoard.loopIds[0].index !== loopIndex.index) {
  //   pressHandler(makePrediction(), loopIndex);
  // }
  pressHandler(makePrediction(), loopIndex);
}

function eventHandlers() {
  document.body.addEventListener("keypress", pressHandler);
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      for (let loop of gameBoard.loopIds) gameBoard.endGame(loop);
    }
  });
  document.querySelector("#trying").addEventListener("click", () => {
    manager.restart(snakes, snakeObjects, gameBoard);
  });
}

const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = manager.populate(gameBoard.canvas.length, snakeObjects, gameBoard);
  for (let snake of snakes) { snake.spawnFood(); }
  
  gameBoard.startGame();
}

function init() {
  if (!localStorage.getItem("totalCanvas")) { localStorage.setItem("totalCanvas", 4); };
  let parentElem = document.querySelector('[class="gameDiv"] > div');
  manager = new boardManager();
  manager.createGameGround(parentElem, localStorage.totalCanvas);
  eventHandlers();
  console.log(localStorage);
  runOnLoad();
}

window.addEventListener("load", (event) => {
  init();
});
