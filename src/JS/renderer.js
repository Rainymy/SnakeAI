function boardProps(boxes) {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.totalBoxes = boxes || 10;
  this.boxPixel = this.canvas.width / this.totalBoxes;
  this.startGame = function() {
    this.drawMap();
  }
  this.endGame = function () {
    clearInterval(this.loopId);
  }
  this.loopId = setInterval(update, 120);
  this.spawnFood = (x, y) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.character = (body) => {
    for (let i = 0; i < body.length; i++) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(body[i].x, body[i].y, this.boxPixel, this.boxPixel);
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
  this.body = [
    {
      x: this.x, 
      y: this.y 
    },
    {
      x: this.x, 
      y: this.y
    },
    {
      x: this.x, 
      y: this.y
    }
  ];
  this.direction = { x: 0, y: 0, letter: null };
}
let totalRowBoxes = 20;
let gameBoard;
let snakes;

function pressHandler(event) {
  console.log(event.key);
  if (event.key === "w" && snakes.direction.letter !== "s") {
    return { x: 0, y: -1, letter: "w" };
  }
  else if (event.key === "s" && snakes.direction.letter !== "w") {
    return { x: 0, y: 1, letter: "s" };
  }
  else if (event.key === "d" && snakes.direction.letter !== "a") {
    return { x: 1, y: 0, letter: "d" };
  }
  else if (event.key === "a" && snakes.direction.letter !== "d") {
    return { x: -1, y: 0, letter: "a" };
  }
  return snakes.direction;
}

const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = new propObjects(gameBoard.boxPixel, gameBoard.totalBoxes);
  document.body.addEventListener("keypress", (event) => {
    snakes.direction = pressHandler(event);
  });
  gameBoard.startGame();
}

function update() {  
  gameBoard.ctx.clearRect(0, 0, gameBoard.canvas.width, gameBoard.canvas.height);
  gameBoard.drawMap();
  gameBoard.character(snakes.body);
  
  // for (let i = 0; i < snakes.body.length; i++) {
  //   snakes.body[i].x += snakes.direction.x * gameBoard.boxPixel;
  //   snakes.body[i].y += snakes.direction.y * gameBoard.boxPixel;
  // }
  snakes.body.unshift({
    x: snakes.body[0].x + snakes.direction.x * gameBoard.boxPixel,
    y: snakes.body[0].y + snakes.direction.y * gameBoard.boxPixel
  });
  snakes.body.pop();
}
window.addEventListener("load", (event) => {
  runOnLoad();
  console.log(gameBoard);
  console.log(snakes);
})
