function snakeObjects(boxSize, totalBoxes, canvas) {
  this.getRandomLocation = function () {
    // return Math.floor(Math.random() * totalBoxes) * boxSize;
    return Math.floor(0.5 * totalBoxes) * boxSize;
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
  this.getOpposite = function (direction) {
    if (direction.letter === "w") return { x: 0, y: 1, letter: "s" };
    if (direction.letter === "s") return { x: 0, y: -1, letter: "w" };
    if (direction.letter === "a") return { x: 1, y: 0, letter: "d" };
    if (direction.letter === "d") return { x: -1, y: 0, letter: "a" };
    return [];
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
  this.bodies = [
    {
      x: this.x, 
      y: this.y,
      invisible: false
    },
    {
      x: this.x, 
      y: this.y,
      invisible: true
    }
  ];
  this.foods = [];
  this.lastDirection = {};
  this.direction = { x: 0, y: 0, letter: null };
  // this.direction = { x: -1, y: 0, letter: "w" };
}
