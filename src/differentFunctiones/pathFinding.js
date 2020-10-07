const aStar = new function () {
  this.mapGrid = null;
  this.createGridFromList = function(list) {
    let grid = [];
    let last = null;
    for (let [index, current] of list.entries()) {
      if (!last || current.x !== last.x) {
        last = current;
        grid.push([]);
      }
      grid[grid.length - 1].push(0);
    }
    return grid;
  }
  this.init = function(obj, map) {
    if (!this.mapGrid) { this.mapGrid = this.createGridFromList(map); }
    console.log(this.mapGrid);
  }
  this.findPathFromTo = function (snakeHead, food) {
    return;
  }
}