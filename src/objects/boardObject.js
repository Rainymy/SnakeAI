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
  this.loopIds = [];
  this.startGame = function () {
    for(let i = 0; i < this.canvas.length; i++) {
      this.loopIds.push({
        intervalId: setInterval(() => this.switcher(i), 120),
        index: i
      });
    }
  }
  this.switcher = (index) => {
    update(this.loopIds[index]);
  }
  this.endGame = function (loopObj) {
    clearInterval(loopObj.intervalId);
  }
  this.isGameEnded = function (bodies, loopObj) {
    for (let [ i, body ] of bodies.entries()) {
      if (
          this.canvas[loopObj.index].width  <= body.x || 0 > body.x ||
          this.canvas[loopObj.index].height <= body.y || 0 > body.y
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
  this.clearScreen = (loopObj) => {
    let context = this.canvas[loopObj.index];
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
  this.drawFoods = (foods, loopObj) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, "green", loopObj.index);
    }
  }
  this.character = (bodies, loopObj) => {
    for (let body of bodies) {
      this.drawSolidRect(body.x, body.y, "red", loopObj.index);
    }
  }
  this.drawSqure = (x, y, size) => {
    for (let context of this.ctx) {
      context.beginPath();
      context.rect(x, y, size || this.boxPixel, size || this.boxPixel);
      context.stroke();
    }
  };
  this.drawMap = (loopObj) => {
    for (let canvas of this.canvas) {
      for (let i = 0; i < this.canvas[loopObj.index].width/this.boxPixel; i++) {
        for (let j = 0; j < this.canvas[loopObj.index].height/this.boxPixel; j++) {
          this.drawSqure(i * this.boxPixel, j * this.boxPixel, this.boxPixel);
        }
      }
    }
  }
}