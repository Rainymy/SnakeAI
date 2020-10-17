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
    this.heuristic = function (start, end) {
      let dx = Math.abs(end.row - start.row);
      let dy = Math.abs(end.column - start.column);
      return dx + dy;
    }
    this.getTileCost = function (startPos, midPos, endPos) {
      let dx = startPos.row - midPos.row; 
      let dy = startPos.column - midPos.column;
      let dx1 = midPos.row - endPos.row;
      let dy1 = midPos.column - endPos.column;
      
      return this.heuristic(startPos, endPos);
      // return this.hypotenuse(dx, dy) + this.hypotenuse(dx1, dy1);
    }
    this.getLowestCostTile = function (array, main, endPos) {
      let temp = [];
      for (let middle of array) {
        temp.push(this.getTileCost(main, middle, endPos));
      }
      return array[this.getIndexWithHighestValue(temp)];
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
  this.getWalkableNeighbour = function (head, walked) {
    let walkableNodes = [];
    if (this.mapGrid[head.row - 1]) {
      if (this.mapGrid[head.row - 1][head.column] === 0) {
        walkableNodes.push({ row: head.row - 1, column: head.column });
      }
      else if (this.mapGrid[head.row - 1][head.column] === -1) {
        walkableNodes.push({ row: head.row - 1, column: head.column });
      }
    }
    if (this.mapGrid[head.row + 1]) {
      if (this.mapGrid[head.row + 1][head.column] === 0) {
        walkableNodes.push({ row: head.row + 1, column: head.column })
      }
      else if (this.mapGrid[head.row + 1][head.column] === -1) {
        walkableNodes.push({ row: head.row + 1, column: head.column })
      }
    }
    if (this.mapGrid[head.row][head.column - 1] === 0) {
      walkableNodes.push({ row: head.row, column: head.column - 1 })
    }
    else if (this.mapGrid[head.row][head.column - 1] === -1) {
      walkableNodes.push({ row: head.row, column: head.column - 1 })
    }
    if (this.mapGrid[head.row][head.column + 1] === 0) {
      walkableNodes.push({ row: head.row, column: head.column + 1 })
    }
    else if (this.mapGrid[head.row][head.column + 1] === -1) {
      walkableNodes.push({ row: head.row, column: head.column + 1 })
    }
    for (let i = 0; i < walked.length; i++) {
      for (let j = 0; j < walkableNodes.length; j++) {
        if ( walkableNodes[j].row === walked[i].row && 
            walkableNodes[j].column === walked[i].column ) {
          walkableNodes.splice(j, 1);
          j--;
        };
      }
    }
    return walkableNodes;
  }
  this.colourize = function (array) {
    for (let [i, per] of array.reverse().entries()) {
      gameBoard.colourize(per, i === array.length - 1 ? true: false);
    }
  }
  this.tracePath = function (curr) {
    let ret = [];
    while (curr.parent) { ret.push(curr); curr = curr.parent; }
    // this.colourize(ret);
    return ret.reverse();
  }
  this.findPathFromTo = function (head, food) {
    if (!this.Math.parent) { this.Math.init(this); }
    
    
    let closedNode = [];
    let openNode = [head];
    let hasBeen = [];
    
    let currentNode;
    let totalLoop = 0;
    
    while (openNode.length) {
      currentNode = this.Math.getLowestCostTile(openNode, head, food);
      if (currentNode.row === food.row && currentNode.column === food.column) {
        console.log("PATH FOUND");
        return this.tracePath(currentNode);
      }
      closedNode.push(openNode.splice(openNode.indexOf(currentNode), 1));
      for (let neighbour of this.getWalkableNeighbour(currentNode, closedNode)) {
        if (!currentNode.visited || -1 === openNode.indexOf(neighbour)) {
          neighbour.parent = currentNode;
          neighbour.visited = true;
          openNode.push(neighbour);
          hasBeen.push(currentNode);
        }
      }
      if (++totalLoop === 100) {
        // this.colourize(hasBeen);
        console.log("PATH NOT FOUND!");
        break;
      }
    }
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
  this.translate = function (instructions, startPos) {
    let keyPressOrder = [];
    let last = startPos;
    for (let instruction of instructions || []) {
      if (0 > last.row - instruction.row) {
        keyPressOrder.push("d");
      }
      else if (0 < last.row - instruction.row) {
        keyPressOrder.push("a");
      }
      else if (0 > last.column - instruction.column) {
        keyPressOrder.push("s");
      }
      else if (0 < last.column - instruction.column) {
        keyPressOrder.push("w");
      }
      last = instruction;
    }
    return keyPressOrder;
  }
  this.search = function(obj, map) {
    this.update(obj, map);
    let allLocation = this.getAllObjectLocation();
    let nearestFoodCoordinate = this.getNearestFood(allLocation);
    let foundPath = this.findPathFromTo(allLocation.head, nearestFoodCoordinate);
    return this.translate(foundPath, allLocation.head);
  }
}