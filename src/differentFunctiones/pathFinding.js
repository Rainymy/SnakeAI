const aStar = new function () {
  "use strict";
  const Initial = {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  }
  this.mapGrid = null;
  this.mapArrayWithPosition = null;
  this.getObjectArray = function(options, defaultValue) {
    return Object.assign({
      isWall: false,
      isFood: false, 
      isHead: false
    }, options, defaultValue);
  }
  this.convertGridToArray = function(list, walls, foods) {
    let grid = [];
    let last = null;
    outer: for (let current of list) {
      if (!last || current.x !== last.x) {
        last = current;
        grid.push([]);
      }
      for (let food of foods) {
        if (food.x === current.x && food.y === current.y) {
          grid[grid.length - 1].push(this.getObjectArray({ isFood: true }, current));
          continue outer;
        }
      }
      for (let [j, wall] of walls.entries()) {
        if (j !== 0 && wall.x === current.x && wall.y === current.y) {
          grid[grid.length - 1].push(
            this.getObjectArray(j === 1 ? {isHead: true}: {isWall: true}, current)
          );
          continue outer;
        }
      }
      grid[grid.length - 1].push(this.getObjectArray(current));
    }
    return grid;
  }
  this.createGridFromArray = function(lists) {
    let grid = [];
    let last = null;
    for (let current of lists) {
      for (let obj of current) {
        if (!last || last.x !== obj.x) {
          last = obj;
          grid.push([]);
        }
        
             if (obj.isHead) { grid[grid.length - 1].push(Initial.HEAD); } 
        else if (obj.isWall) { grid[grid.length - 1].push(Initial.WALL); } 
        else if (obj.isFood) { grid[grid.length - 1].push(Initial.FOOD); } 
        else                 { grid[grid.length - 1].push(Initial.AIR); }
      }
    }
    return grid;
  }
  this.findPathFromTo = function (snakeHead, food) {
    return null;
  }
  this.getNearestFood = function ( objects ) {
    return objects;
  }
  this.getAllObjectLocation = function() {
    let obj = { head: [], food: [] };
    for (let [i, x] of this.mapGrid.entries()) {
      for (let [j, y] of x.entries()) {
        if (y === Initial.HEAD) { obj.head = { row: i, column: j }; }
        else if (y === Initial.FOOD) { obj.food.push({ row: i, column: j }); }
      }
    }
    return obj;
  }
  this.search = function(obj, map) {
    if (!this.mapGrid) {
      let start = performance.now();
      this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
      this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
    }
    this.getAllObjectLocation();
  }
}

