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
  this.totalLeft = 0;
  this.startGame = function () {
    for (let loop of this.loopIds) { clearInterval(loop.intervalId); }
    for (let i = 0; i < this.canvas.length; i++) {
      this.loopIds.push({
        intervalId: setInterval(() => this.runAgain(i), 120),
        index: i
      });
    }
    this.totalLeft = this.canvas.length;
  }
  this.runAgain = (index) => {
    update(this.loopIds[index]);
  }
  this.endGame = function (loopObj) {
    clearInterval(loopObj.intervalId);
    this.totalLeft--;
  }
  this.isGameEnded = function (bodies, loopObj) {
    for (let [ i, body ] of bodies.entries()) {
      // if head is outside of the box 
      if (
          this.canvas[loopObj.index].width  <= body.x || 0 > body.x ||
          this.canvas[loopObj.index].height <= body.y || 0 > body.y
        ) {
        return true;
      }
      // if body has invisbale property
      if (i === 0 || body.invisible) {
        continue; 
      }
      // if head crashed with body part
      if (bodies.length >= 3 && body.x === bodies[0].x  && body.y === bodies[0].y) {
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
  this.clearPixel = (x, y, loopObj) => {
    let context = this.canvas[loopObj.index];
    context.getContext('2d').clearRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.moveSnake = function (obj, loopObj) {
    let body = obj.bodies;
    body.unshift({
      x: body[0].x + obj.direction.x * this.boxPixel,
      y: body[0].y + obj.direction.y * this.boxPixel,
      invisible: false
    });
    let last = body.pop();
    body[body.length - 1].invisible = true;
    if (obj.direction.x === 0 && obj.direction.y === 0) {
      return [{ x: -this.boxPixel, y: -this.boxPixel }]
    }
    return [last];
  }
  this.drawSolidRect = (x, y, index, colour) => {
    let context = this.ctx[index];
    context.beginPath();
    context.fillStyle = colour || "black";
    context.fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods, loopObj) => {
    for (let food of foods) {
      this.drawSolidRect(food.x, food.y, loopObj.index, "green");
    }
  }
  this.character = (bodies, loopObj) => {
    for (let [index, body] of bodies.entries()) {
      if (body.invisible) { continue; }
      this.drawSolidRect(body.x, body.y, loopObj.index, "red");
    }
  }
  this.drawSqure = (x, y, index) => {
    let context = this.ctx[index];
    context.beginPath();
    context.rect(x, y, this.boxPixel, this.boxPixel);
    context.stroke();
  };
  this.drawMap = (loopObj) => {
    for (let canvas of this.canvas) {
      for (let i = 0; i < this.canvas[loopObj.index].width/this.boxPixel; i++) {
        for (let j = 0; j < this.canvas[loopObj.index].height/this.boxPixel; j++) {
          this.drawSqure(i * this.boxPixel, j * this.boxPixel, loopObj.index);
        }
      }
    }
  }
  this.drawMapPart = (parts, loopObj) => {
    for (let [index, part] of parts.entries()) {
      if (part === undefined) { break; }
      this.clearPixel(part.x, part.y, loopObj);
      this.drawSqure(part.x ,part.y, loopObj.index);
      parts.splice(index, 1);
    }
  }
}