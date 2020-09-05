let totalRowBoxes = 25;
let gameBoard;
let snakes;

function pressHandler(event) {
  if (event.key === "w" && snakes.direction.letter !== "s") {
    snakes.pressQueue.push({ x: 0, y: -1, letter: "w" });
  }
  else if (event.key === "s" && snakes.direction.letter !== "w") {
    snakes.pressQueue.push({ x: 0, y: 1, letter: "s" });
  }
  else if (event.key === "d" && snakes.direction.letter !== "a") {
    snakes.pressQueue.push({ x: 1, y: 0, letter: "d" });
  }
  else if (event.key === "a" && snakes.direction.letter !== "d") {
    snakes.pressQueue.push({ x: -1, y: 0, letter: "a" });
  }
}

function update() {  
  gameBoard.clearScreen();
  gameBoard.character(snakes.bodies);
  if (gameBoard.isGameEnded(snakes.bodies)) {
    gameBoard.endGame();
    document.getElementById('gameOver').parentNode.style.display = "inline-block";
  }
  
  for (let [ index, food ] of snakes.foods.entries()) {
    if (food.x === snakes.bodies[0].x && food.y === snakes.bodies[0].y) {
      document.getElementById("score").textContent = snakes.score += 1; 
      snakes.bodies.push({
        x: snakes.bodies[0].x,
        y: snakes.bodies[0].y
      });
      let newFood = snakes.getRandomAvailableLocation();
      console.log(newFood);
      snakes.foods.splice(index, 1, {
        x: newFood.x,
        y: newFood.y
      });
    }
  }
  gameBoard.drawFoods( snakes.foods );
  
  if (snakes.pressQueue.length) { snakes.direction = snakes.pressQueue.shift(); }
  
  snakes.bodies.unshift({
    x: snakes.bodies[0].x + snakes.direction.x * gameBoard.boxPixel,
    y: snakes.bodies[0].y + snakes.direction.y * gameBoard.boxPixel
  });
  snakes.bodies.pop();
  gameBoard.drawMap();
}
  
const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = new snakeObjects(gameBoard.boxPixel, gameBoard.totalBoxes);
  snakes.spawnFood();
  document.body.addEventListener("keypress", pressHandler);
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Escape") { gameBoard.endGame(); }
  });
  gameBoard.startGame();
}

window.addEventListener("load", (event) => {
  runOnLoad();
  console.log(gameBoard);
  console.log(snakes);
});
