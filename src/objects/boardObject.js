function boardProps(boxes) {
  // Genenal
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(this.canvas.width / this.totalBoxes);
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
          this.canvas.height <= body.y || 0 > body.y
        ) {
        return true;
      }
      if (i === 0) { continue; }
      if (bodies.length >= 2) {
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