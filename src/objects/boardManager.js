function boardManager() {
  this.boardIds = [];
  this.wholeMap = [];
  this.createUniqueId = function () {
    return Math.random().toString(36).substring(2);
  }
  /*---------------------- Map ------------------------*/
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
  this.populate = function (quantity, snakeObj, board) {
    let players = [];
    for (let i = 0; i < quantity; i++) {
      players.push(new snakeObj(board.boxPixel, board.totalBoxes, board.canvas[i]));
      board.clearScreen({ index: i });
      board.drawMap({ index: i });
    }
    return players;
  }
  this.updateScore = function () {
    for (let board of this.boardIds) {
      let parent = document.querySelector(`[id="${board}"]`);
      parent.replaceChild(this.createScoreElement(), parent.firstChild);
    }
  }
  this.restart = function (snakes, snakeObj, board) {
    let newSnake = this.populate(snakes.length, snakeObj, board);
    snakes.length = 0;
    snakes.push(...newSnake);
    for (let loopId of board.loopIds) { board.endGame(loopId); }
    this.updateScore();
    runOnLoad();
  }
}