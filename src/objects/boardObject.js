function boardProps(boxes) {
  // Genenal
  this.canvas = document.getElementsByTagName('canvas');
  this.ctx = (() => {
    let ctx = [];
    for (let context of this.canvas) ctx.push(context.getContext('2d'));
    return ctx;
  })();
  this.totalBoxes = Math.floor(boxes) || 10;
  this.boxPixel = Math.round(this.canvas[0].width / this.totalBoxes);
  // Game logices
  this.loopIds = [];
  this.startGame = function () {
    for (let loop of this.loopIds) { clearInterval(loop.intervalId); }
    for (let i = 0; i < this.canvas.length; i++) {
      this.loopIds.push({
        intervalId: setInterval(this.runAgain, 120, i),
        index: i
      });
    }
    return this;
  }
  this.runAgain = (index) => update(this.loopIds[index]);
  this.endGame = (loopObj) => clearInterval(loopObj.intervalId);
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
      if (i === 0 || body.invisible) { continue; }
      // if head crashed with body part
      if (body.x === bodies[0].x  && body.y === bodies[0].y) {
        console.log("Suicide");
        return true;
      }
    }
    return false;
  }
  this.checkNearBorder = function (borders, currentSnake, threshold) {
    let head = currentSnake.bodies[0];
    let nextDirection = currentSnake.pressQueue[1];
    let direction = currentSnake.pressQueue[0] && currentSnake.pressQueue[0].letter;
    
    for (let border of borders) {
      if (border.hasOwnProperty("width")) {
        if ((border.width - head.x) / this.boxPixel === threshold) {
          if (nextDirection && direction === "d" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.width / 2 < head.y) {
              console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              console.log("Go Down");
              currentSnake.pressQueue.push({ x: 0, y: 1, letter: "s" });
            }
          }
        }
        if ((head.x / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "a" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.width / 2 < head.y) {
              console.log("Go Up");
              currentSnake.pressQueue.push({ x: 0, y: -1, letter: "w" });
            }
            else {
              console.log("Go Down");
              currentSnake.pressQueue.push({ x: 0, y: 1, letter: "s" });
            }
          }
        }
      }
      else {
        if ((border.height - head.y)/ this.boxPixel === threshold) {
          if (nextDirection && direction === "s" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.height / 2 < head.x) {
              console.log("Go Right");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              console.log("Go Left");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
        if ((head.y / this.boxPixel) === threshold - 1) {
          if (nextDirection && direction === "w" || !nextDirection) {
            currentSnake.pressQueue.length = 0;
            if (border.height / 2 < head.x) {
              console.log("Go Left");
              currentSnake.pressQueue.push({ x: -1, y: 0, letter: "a" });
            }
            else {
              console.log("Go Right");
              currentSnake.pressQueue.push({ x: 1, y: 0, letter: "d" });
            }
          }
        }
      }
    }
  }
  // Entities/Structure
  this.clearScreen = (loopObj) => {
    let context = this.canvas[loopObj.index];
    context.getContext('2d').clearRect(0, 0, context.width, context.height);
  }
  this.clearPixel = (x, y, loopObj) => {
    this.canvas[loopObj.index].getContext('2d').clearRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawSolidRect = (x, y, index, colour) => {
    this.ctx[index].beginPath();
    this.ctx[index].fillStyle = colour || "black";
    this.ctx[index].fillRect(x, y, this.boxPixel, this.boxPixel);
  }
  this.drawFoods = (foods, loopObj) => {
    for (let food of foods) this.drawSolidRect(food.x, food.y, loopObj.index, "green");
  }
  this.character = (bodies, loopObj) => {
    this.drawSolidRect(bodies[0].x, bodies[0].y, loopObj.index, "red");
  }
  this.container = [];
  this.colourize = (position, visualize, speed) => {
    let location;
    if (position.hasOwnProperty("row")) {
      location = { x: position.row * this.boxPixel, y: position.column * this.boxPixel }
    }
    this.container.push(location);
    if (visualize) {
      let id = setInterval(() => {
        if (this.container.length <= 0) return clearInterval(id);
        let { x, y } = this.container.shift();
        this.drawSolidRect(x, y, 0, "white");
      }, parseInt(speed) || 250);
    }
  }
  this.drawSqure = (x, y, index) => {
    this.ctx[index].beginPath();
    this.ctx[index].rect(x, y, this.boxPixel, this.boxPixel);
    this.ctx[index].stroke();
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
      this.clearPixel(part.x, part.y, loopObj);
      this.drawSqure(part.x ,part.y, loopObj.index);
    }
  }
}