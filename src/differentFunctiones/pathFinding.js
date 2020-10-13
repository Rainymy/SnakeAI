const aStar = new function () {
  "use strict";
  const Initial = {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  };
  this.STRAIGHT_COST = 1;
  this.mapGrid = null;
  this.mapArrayWithPosition = null;
  
  this.Math = new function () {
    this.parent = null;
    this.init = function (parentObj) {
      parentObj.Math 
        ? this.parent = parentObj 
        : console.log("Object isn't the parent");
    }
    this.hypotenuse = function (a, b) {
      return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    this.getIndexWithHighestValue = function (array) {
      let index = 0;
      let highest = 0;
      // go through the array and pick the first index then compare
      // the first and second value, if second is higher then pick second
      while (index++ < array.length) {
        if (array[highest] > array[index]) {
          highest = index;
        }
      }
      return highest;
    }
    this.getTileCost = function (startPos, endPos) {
      let dx = startPos.row - endPos.row; 
      let dy = startPos.column - endPos.column;;
      return this.hypotenuse(dx, dy) * this.parent.STRAIGHT_COST;
    }
  }
  this.update = function (obj, map) {
    this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
    this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
  }
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
  this.findPathFromTo = function (head, food) {
    if (!this.Math.parent) { this.Math.init(this); }
    
    let cost = this.Math.getTileCost(head, food);
    console.log(cost);
    return null;
  }
  this.getNearestFood = function ( objects ) {
    let deltaX = null;
    let deltaY = null;
    let temp = [];
    for (let food of objects.food) {
      deltaX = food.row - objects.head.row;
      deltaY = food.column - objects.head.column;
      temp.push(this.Math.hypotenuse(deltaX, deltaY));
    }
    return objects.food[this.Math.getIndexWithHighestValue(temp)];
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
    this.update(obj, map);
    let allLocation = this.getAllObjectLocation();
    let nearestFoodCoordinate = this.getNearestFood(allLocation);
    this.findPathFromTo(allLocation.head, nearestFoodCoordinate);
  }
}

