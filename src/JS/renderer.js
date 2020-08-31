function boardProps(boxes) {
  // Genenal
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.totalBoxes = boxes || 10;
  this.boxPixel = this.canvas.width / this.totalBoxes;
  // Game logices
  this.loopId = null;
  this.startGame = function () {
    this.drawMap();
    this.loopId = setInterval(update, 120);
  }
  this.endGame = function () { clearInterval(this.loopId); }
  this.isGameEnded = function (bodies) {
    for (let [ i, body ] of bodies.entries()) {
      if (
          this.canvas.width  <= body.x || 0 > body.x ||
          this.canvas.height <= body.y || 0 > body.x
        ) {
        return true;
      }
      if (i === 0) { continue; }
      if (bodies.length > 1) {
        if (body.x === bodies[0].x  && body.y === bodies[0].y) {
          return true;
        }
      }
    }
    return false;
  }
  // Entities/Structure
  this.clearScreen = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  this.drawSolidRect = (x, y, colour) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = colour || "black";
    this.ctx.fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, "green");
    }
  }
  this.character = (bodies) => {
    for (let body of bodies) {
      this.drawSolidRect(body.x, body.y, "red");
    }
  }
  this.drawSqure = (x, y, size) => {
    this.ctx.beginPath();
    this.ctx.rect(x, y, size || this.boxPixel, size || this.boxPixel);
    this.ctx.stroke();
  };
  this.drawMap = () => {
    for (let i = 0; i < this.canvas.width/this.boxPixel; i++) {
      for (let j = 0; j < this.canvas.height/this.boxPixel; j++) {
        this.drawSqure(i * this.boxPixel, j * this.boxPixel, this.boxPixel);
      }
    }
  }
}

function propObjects(boxSize, totalBoxes) {
  this.getRandomLocation = () => Math.floor(Math.random() * totalBoxes) * boxSize;
  this.x = this.getRandomLocation();
  this.y = this.getRandomLocation();
  this.score = 0;
  this.pressQueue = [];
  this.bodies = [
    {
      x: this.x, 
      y: this.y 
    }
  ];
  this.foods = [
    {
      x: this.getRandomLocation(),
      y: this.getRandomLocation()
    },
    {
      x: this.getRandomLocation(),
      y: this.getRandomLocation()
    }
  ];
  this.direction = { x: 0, y: 0, letter: null };
}
// General Decleration
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

const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = new propObjects(gameBoard.boxPixel, gameBoard.totalBoxes);
  document.body.addEventListener("keypress", pressHandler);
  document.body.addEventListener("keyup", (event) => {
    if (event.key === "Escape") { gameBoard.endGame(); }
  });
  gameBoard.startGame();
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
      snakes.foods.splice(index, 1, {
        x: snakes.getRandomLocation(),
        y: snakes.getRandomLocation()
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

window.addEventListener("load", (event) => {
  runOnLoad();
  console.log(gameBoard);
  console.log(snakes);
})
