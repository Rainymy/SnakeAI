let totalRowBoxes = 25;
let gameBoard;
let snakes = [];
let currentSnake = null;

function pressHandler(event, index) {
  let obj = snakes[index];
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
  console.count();
  currentSnake = snakes[loopIndex];
  gameBoard.clearScreen(loopIndex);
  gameBoard.character(currentSnake.bodies, loopIndex);
  
  if (gameBoard.isGameEnded(currentSnake.bodies, loopIndex)) {
    gameBoard.endGame(loopIndex + 1);
    document.getElementById('gameOver').parentNode.style.display = "inline-block";
  }
  for (let [ index, food ] of currentSnake.foods.entries()) {
    if (food.x === currentSnake.bodies[0].x && food.y === currentSnake.bodies[0].y) {
      document.getElementById("score").textContent = currentSnake.score += 1; 
      currentSnake.bodies.push({
        x: currentSnake.bodies[0].x,
        y: currentSnake.bodies[0].y
      });
      let newFood = currentSnake.getRandomAvailableLocation();
      currentSnake.foods.splice(index, 1, {
        x: newFood.x,
        y: newFood.y
      });
    }
  }
  
  gameBoard.drawFoods( currentSnake.foods, loopIndex );
  
  if (currentSnake.pressQueue.length) {
    currentSnake.direction = currentSnake.pressQueue.shift();
  }
  
  gameBoard.moveSnake(currentSnake);
  gameBoard.drawMap(loopIndex);
  // if (loopIndex !== 0) { pressHandler(makePrediction(), loopIndex); } 
  pressHandler(makePrediction(), loopIndex);
}
  
const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = (() => {
    let players = [];
    for (let i = 0; i < gameBoard.canvas.length; i++) {
      players.push(new snakeObjects(gameBoard.boxPixel, gameBoard.totalBoxes));
    }
    return players;
  })();
  for (let snake of snakes) { snake.spawnFood(); }
  // document.body.addEventListener("keypress", pressHandler);
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      for (let loop of gameBoard.loopId) { gameBoard.endGame(loop); }
      return null;
    }
  });
  gameBoard.startGame();
}

window.addEventListener("load", (event) => {
  runOnLoad();
  console.log(gameBoard);
});