function boardProps(boxes) {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.totalBoxes = boxes || 10;
  this.boxPixel = this.canvas.width / this.totalBoxes;
  this.startGame = () => {
    update();
  }
  this.character = (x, y) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x, y, this.boxPixel, this.boxPixel);
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
  this.randomPosition = () => Math.floor(Math.random() * totalBoxes) * boxSize;
  this.x = this.randomPosition();
  this.y = this.randomPosition();
}
let totalRowBoxes = 20;
let gameBoard;
let snakes;

const runOnLoad = () => {
  gameBoard = new boardProps(totalRowBoxes);
  snakes = new propObjects(gameBoard.boxPixel, gameBoard.totalBoxes);
  gameBoard.startGame();
}

function update() {  
  gameBoard.drawMap();
  gameBoard.character(snakes.x, snakes.y);
}
window.addEventListener("load", (event) => {
  runOnLoad();
  console.log(gameBoard);
  console.log(snakes);
})
