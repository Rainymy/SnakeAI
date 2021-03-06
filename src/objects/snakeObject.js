function snakeObjects(boxSize, totalBoxes, canvas) {
  this.getRandomLocation = function () {
    return Math.floor(Math.random() * totalBoxes) * boxSize;
  }
  this.getOpposite = function (direction) {
    if (typeof direction === undefined || direction == undefined) return [];
    if (direction.letter === "w") return this.compass.up;
    if (direction.letter === "s") return this.compass.down;
    if (direction.letter === "a") return this.compass.right;
    if (direction.letter === "d") return this.compass.left;
    return [];
  }
  this.getNextDirection = function () {
    let direction = this.pressQueue.shift();
    let oppositeOfLast = this.getOpposite(this.lastDirection);
    
    if ((direction && direction.letter) === oppositeOfLast.letter) {
      direction = this.getOpposite(direction);
    }
    
    if (direction) { this.lastDirection = direction; }
    return direction || this.direction;
  }
  this.moveSnake = function () {
    let body = this.bodies;
    body.unshift({
      x: body[0].x + this.direction.x * boxSize,
      y: body[0].y + this.direction.y * boxSize,
      invisible: false
    });
    let last = body.pop();
    body[body.length - 1].invisible = true;
    
    return this.direction.x === 0 && this.direction.y === 0 
      ? [{ x: -boxSize, y: -boxSize }] : [last];
  }
  this.pressHandler = function (key) {
    let direction = this.direction;
    if (key === "w" && direction !== "s") return this.compass.up;
    else if (key === "s" && direction !== "w") return this.compass.down;
    else if (key === "d" && direction !== "a") return this.compass.right;
    else if (key === "a" && direction !== "d") return this.compass.left;
    return null;
  }
  this.spawnFood = function (locations) {
    for (let location of locations) this.foods.push({ x: location.x, y: location.y });
  }
  this.getRandomColor = function () {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }
  this.x = this.getRandomLocation();
  this.y = this.getRandomLocation();
  this.color = this.getRandomColor();
  this.threshold = 1;
  this.score = 0;
  this.frames = 0;
  this.canvas = canvas;
  this.pressQueue = [];
  this.compass = {
    up:    { x: 0,  y: -1, letter: "w" },
    down:  { x: 0,  y: 1,  letter: "s" },
    right: { x: 1,  y: 0,  letter: "d" },
    left:  { x: -1, y: 0,  letter: "a" }
  };
  this.bodies = [
    { x: this.x, y: this.y, invisible: false },
    { x: this.x, y: this.y, invisible: true }
  ];
  this.foods = [];
  this.lastDirection = [];
  this.direction = (() => {
    // from start pick a random direction
    let keys = Object.keys(this.compass);
    return this.compass[keys[Math.floor(keys.length * Math.random())]];
  })();
}
