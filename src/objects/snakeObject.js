function snakeObjects(boxSize, totalBoxes, canvas) {
  this.getRandomLocation = function () {
    return Math.floor(Math.random() * totalBoxes) * boxSize;
  }
  this.getRandomAvailableLocation = function () {
    if (!this.isMapAvaible()) { this.wholeMap = this.getFullMap(); }
    let avaible = this.wholeMap.filter((item, i) => {
      for (let body of this.bodies) {
        if (body.x !== item.x) { return true; } 
        else if (body.y !== item.y) { return true; } 
        else if (body.x !== item.x && body.y !== item.y) { return false; }
      }
    });
    return avaible[Math.floor(Math.random() * avaible.length)];
  }
  this.generateRandomColor = function () {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }
  this.x = this.getRandomLocation();
  this.y = this.getRandomLocation();
  this.isMapAvaible = function () {
    if (this.wholeMap.length <= 0 || !Array.isArray(this.wholeMap)) {
      return false;
    }
    return true;
  }
  this.getFullMap = function () {
    let wholeMap = [];
    for (let i = 0; i < totalBoxes; i++) {
      for (let j = 0; j < totalBoxes; j++) {
        wholeMap.push({ x: i * boxSize , y: j * boxSize });
      }
    }
    return wholeMap;
  }
  this.spawnFood = function (total = 2) {
    for (let i = 0; i < total; i++) {
      let location = this.getRandomAvailableLocation();
      this.foods.push({
        x: location.x,
        y: location.y
      });
    }
  }
  this.wholeMap = [];
  this.score = 0;
  this.frames = 0;
  this.canvas = canvas;
  this.color = this.generateRandomColor();
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
  this.direction = { x: 0, y: 0, letter: null };
}