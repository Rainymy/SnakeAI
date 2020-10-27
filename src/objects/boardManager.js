function boardManager() {
  this.gameBoard = null;
  this.wholeMap = null;
  this.boardIds = [];
  /*-------------------- General ----------------------*/
  this.createUniqueId = function () {
    return Math.random().toString(36).substring(2);
  }
  this.populate = function (quantity, snakeObj, board) {
    let players = [];
    for (let i = 0; i < quantity; i++) {
      players.push(new snakeObj(board.boxPixel, board.totalBoxes, board.canvas[i]));
      board.clearScreen({ index: i });
      board.drawMap({ index: i });
    }
    return players;
  }
  this.reInit = function (snakes, snakeObj, board) {
    let newSnake = this.populate(snakes.length, snakeObj, board);
    snakes.length = 0;
    snakes.push(...newSnake);
    for (let loopId of board.loopIds) { board.endGame(loopId); }
    this.resetScore();
  }
  /*---------------------- Map ------------------------*/
  this.getRandomAvailableLocation = function (bodies, size) {
    if (!this.isMapAvaible()) { this.wholeMap = this.getFullMap(); }
    let available = this.wholeMap.filter((item, i) => {
      for (let body of bodies) {
        if (body.x !== item.x) { return true; } 
        else if (body.y !== item.y) { return true; } 
        else if (body.x !== item.x && body.y !== item.y) { return false; }
      }
    });
    return available.length 
      ? available[Math.floor(Math.random() * available.length)]
      : { x: -size, y: -size }
  }
  this.isMapAvaible = function () {
    return this.wholeMap && Array.isArray(this.wholeMap) ? true: false;
  }
  this.getFullMap = function () {
    let wholeMap = [];
    for (let i = 0; i < this.gameBoard.totalBoxes; i++) {
      for (let j = 0; j < this.gameBoard.totalBoxes; j++) {
        wholeMap.push({
          x: i * this.gameBoard.boxPixel,
          y: j * this.gameBoard.boxPixel
        });
      }
    }
    return wholeMap;
  }
  /*------------------ Spawn Food --------------------*/
  this.spawnFood = function (snake, total=1) {
    let location = null;
    for (let i = 0; i < total; i++) {
      location = this.getRandomAvailableLocation(snake.bodies);
      snake.foods.push({
        // x: location.x,
        // y: location.y
        x: snake.bodies[0].x + this.gameBoard.boxPixel * 0,
        y: snake.bodies[0].y + this.gameBoard.boxPixel * 4
      });
    }
  }
  /*---------------------- UI ------------------------*/
  this.createCanvas = function (width, height, id) {
    let canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  this.createGamerOverElement = function () {
    let over = document.createElement("span");
    over.id = "gameEnded";
    over.textContent = " - Game Over";
    over.style.display = "none";
    return over;
  }
  this.createScoreElement = function (text) {
    let textElem = document.createElement("span");
    textElem.textContent = text || "Score: 0";
    textElem.classList.add("score");
    textElem.appendChild(this.createGamerOverElement());
    return textElem;
  }
  this.createGameGround = function (elem, totalCanvases) {
    let div = null;
    for (let i = 0; i < totalCanvases; i++) {
      div = document.createElement("div");
      div.id = this.createUniqueId();
      div.style.position = "relative";
      div.appendChild(this.createScoreElement());
      div.appendChild(this.createCanvas(500, 500, this.createUniqueId()));
      elem.appendChild(div);
      
      this.boardIds.push(div.id);
    }
  }
  this.resetScore = function () {
    for (let board of this.boardIds) {
      let parent = document.querySelector(`[id="${board}"]`);
      parent.replaceChild(this.createScoreElement(), parent.firstChild);
    }
  }
}