const aStar = new function () {
  this.mapGrid = null;
  this.mapGridWithPosition = [];
  this.createGridFromList = function(list, walls) {
    let grid = [];
    this.mapGridWithPosition = [];
    let last = null;
    outer:for (let [index, current] of list.entries()) {
      if (!last || current.x !== last.x) {
        last = current;
        grid.push([]);
      }
      for (let [j, wall] of walls.entries()) {
        if (j !== 0 && wall.x === current.x && wall.y === current.y) {
          grid[grid.length - 1].push(1);
          continue outer;
        }
      }
      grid[grid.length - 1].push(0);
    }
    return grid;
  }
  this.search = function(obj, map) {
    if (!this.mapGrid) { this.mapGrid = this.createGridFromList(map, obj.bodies); }
    console.log(this.mapGrid);
  }
  this.findPathFromTo = function (snakeHead, food) {
    return null;
  }
}

