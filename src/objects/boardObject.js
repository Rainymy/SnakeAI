function boardProps(boxes) {
  // Genenal
  this.canvas = document.getElementsByTagName('canvas');
  this.ctx = (() => {
    let ctx = [];
    for (let context of this.canvas) { ctx.push(context.getContext('2d')); }
    return ctx;
  })();
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(this.canvas[0].width / this.totalBoxes);
  // Game logices
  this.loopId = [];
  this.startGame = function () {
    // this.drawMap();
    (() => {
      for(let i = 0; i < this.canvas.length; i++) {
        this.loopId.push(setInterval(() => {
          update(i);
        }, 120));
      }
    })();
  }
  this.endGame = function (index) {
    clearInterval(index);
  }
  this.isGameEnded = function (bodies, index) {
    for (let [ i, body ] of bodies.entries()) {
      if (
          this.canvas[index].width  <= body.x || 0 > body.x ||
          this.canvas[index].height <= body.y || 0 > body.y
        ) {
        return true;
      }
      if (i === 0) { continue; }
      if (bodies.length >= 2 && body.x === bodies[0].x  && body.y === bodies[0].y) {
        return true;
      }
    }
    return false;
  }
  // Entities/Structure
  this.clearScreen = (index) => {
    let context = this.canvas[index];
    context.getContext('2d').clearRect(0, 0, context.width, context.height);
  }
  this.moveSnake = function (obj) {
    obj.bodies.unshift({
      x: obj.bodies[0].x + obj.direction.x * this.boxPixel,
      y: obj.bodies[0].y + obj.direction.y * this.boxPixel
    });
    obj.bodies.pop();
  }
  this.drawSolidRect = (x, y, colour, index) => {
    this.ctx[index].beginPath();
    this.ctx[index].fillStyle = colour || "black";
    this.ctx[index].fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods, index) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, "green", index);
    }
  }
  this.character = (bodies, index) => {
    for (let body of bodies) {
      this.drawSolidRect(body.x, body.y, "red", index);
    }
  }
  this.drawSqure = (x, y, size) => {
    for (let context of this.ctx) {
      context.beginPath();
      context.rect(x, y, size || this.boxPixel, size || this.boxPixel);
      context.stroke();
    }
  };
  this.drawMap = (index) => {
    for (let canvas of this.canvas) {
      for (let i = 0; i < this.canvas[index].width/this.boxPixel; i++) {
        for (let j = 0; j < this.canvas[index].height/this.boxPixel; j++) {
          this.drawSqure(i * this.boxPixel, j * this.boxPixel, this.boxPixel);
        }
      }
    }
  }
}