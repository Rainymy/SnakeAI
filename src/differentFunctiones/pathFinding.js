const aStar = new function () {
  "use strict";
  const Initial = {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  };
  
  this.mapGrid = null;
  this.mapArrayWithPosition = null;
  
  this.proto = new function () {
    this.lastElement = function (array) {
      return array[array.length - 1];
    }
    this.isSameCoordinate = function (startPos, endPos) {
      if (!endPos) { return false; }
      if (!startPos) { return false; }
      
      let endX = endPos[ endPos.hasOwnProperty("x") ? "x": "row" ];
      let endY = endPos[ endPos.hasOwnProperty("y") ? "y": "column" ];
      let startX = startPos[ startPos.hasOwnProperty("x") ? "x": "row" ];
      let startY = startPos[ startPos.hasOwnProperty("y") ? "y": "column" ];
      
      return startX === endX && startY === endY;
    }
    this.getInitialValues = function (obj) {
      return obj.isHead 
              ? Initial.HEAD : obj.isWall 
                ? Initial.WALL : obj.isFood 
                  ? Initial.FOOD : Initial.AIR
    }
    this.getObjectArray = function(options, defaultValue) {
      return Object.assign({
        isWall: false,
        isFood: false,
        isHead: false
      }, options, defaultValue);
    }
    this.getNearestLocation = function (array, endPos) {
      // loop through paths and return the nearest path from end position
      console.log(array);
    }
    this.colourize = function (array, endPos) {
      let copy = array.slice();
      for (let [i, per] of copy.entries()) {
        gameBoard.colourize(per, i === copy.length - 1 ? true: false);
      }
      // this.getNearestLocation(copy, endPos);
    }
    this.compareValues = function (firstValue, array) {
      if (firstValue == undefined) { return false; }
      for (let value of array) { if (firstValue === value) { return true; }}
      return false;
    }
    this.translate = function (instructions, startPos) {
      let keyPressOrder = [];
      let last = startPos;
      for (let instruction of instructions || []) {
        if (0 > last.row - instruction.row) { keyPressOrder.push("d"); }
        else if (0 < last.row - instruction.row) { keyPressOrder.push("a"); }
        else if (0 > last.column - instruction.column) { keyPressOrder.push("s"); }
        else if (0 < last.column - instruction.column) { keyPressOrder.push("w"); }
        last = instruction;
      }
      return keyPressOrder;
    }
  }
  this.Math = new function () {
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
    this.getLowestCostTile = function (array, endPos) {
      let temp = [];
      for (let middle of array) {
        temp.push(this.heuristic(middle, endPos));
      }
      return array[this.getIndexWithHighestValue(temp)];
    }
  }
  this.checkAroundMoves = function (foundPath, food) {
    let checkedArray = [];
    for (let path of foundPath) {
      for (let neighbour of this.getWalkableNeighbours(path)) {
        this.proto.isSameCoordinate(neighbour, food);
      }
    }
    return;
  }
  this.convertGridToArray = function (list, walls, foods) {
    let grid = [];
    let last = null;
    outer: for (let current of list) {
      if (!last || current.x !== last.x) {
        last = current;
        grid.push([]);
      }
      for (let food of foods) {
        if (food.x === current.x && food.y === current.y) {
          this.proto.lastElement(grid).push(this.proto.getObjectArray({
            isFood: true
          }, current));
          continue outer;
        }
      }
      for (let [j, wall] of walls.entries()) {
        if (j !== 0 && this.proto.isSameCoordinate(wall, current)) {
          this.proto.isSameCoordinate(wall, current);
          this.proto.lastElement(grid).push(
            this.proto.getObjectArray(j === 1 ? {isHead: true}: {isWall: true}, current)
          );
          continue outer;
        }
      }
      this.proto.lastElement(grid).push(this.proto.getObjectArray(current));
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
        this.proto.lastElement(grid).push(this.proto.getInitialValues(obj));
      }
    }
    return grid;
  }
  this.update = function (obj, map) {
    this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
    this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
  }
  this.getWalkableNeighbours = function (head, walked) {
    walked = walked || [];
    let walkableNodes = new Set([]);
    let compareValues = [ Initial.AIR, Initial.FOOD ];
    
    let middleRow = this.mapGrid[head.row] || [];
    let leftRow = this.mapGrid[head.row - 1] || [];
    let rightRow = this.mapGrid[head.row + 1] || [];
    
    let top = leftRow[head.column];
    let bottom = rightRow[head.column];
    let left = middleRow[head.column - 1];
    let right = middleRow[head.column + 1];
    
    if (this.proto.compareValues(top, compareValues)){
      walkableNodes.add({ row: head.row - 1, column: head.column });
    }
    if (this.proto.compareValues(bottom, compareValues)){
      walkableNodes.add({ row: head.row + 1, column: head.column });
    }
    if (this.proto.compareValues(left, compareValues)) {
      walkableNodes.add({ row: head.row, column: head.column - 1 });
    }
    if (this.proto.compareValues(right, compareValues)) {
      walkableNodes.add({ row: head.row, column: head.column + 1 });
    }
    for (let node of walkableNodes.values()) {
      for (let i = 0; i < walked.length; i++) {
        if (this.proto.isSameCoordinate(walked[i], node)) {
          walkableNodes.delete(node);
          break;
        }
      }
    }
    return [...walkableNodes];
  }
  this.findPathFromTo = function (head, food, direction, index, score) {
    let closedNode = [];
    let openNode = [head];
    
    let currentNode;
    let totalLoop = 0;
    
    while (openNode.length) {
      currentNode = this.Math.getLowestCostTile(openNode, food);
      if (this.proto.isSameCoordinate(currentNode, food)) {
        console.log("PATH FOUND");
        let ret = [];
        let curr = currentNode;
        while (curr.parent) {
          ret.push(curr); 
          curr = curr.parent;
        }
        // this.proto.colourize(ret, food);
        return ret.reverse();
      }
      closedNode.push(...openNode.splice(openNode.indexOf(currentNode), 1));
      for (let neighbour of this.getWalkableNeighbours(currentNode, closedNode)) {
        if (!currentNode.visited || -1 === openNode.indexOf(neighbour)) {
          neighbour.parent = currentNode;
          neighbour.visited = true;
          openNode.push(neighbour);
        }
      }
      if (++totalLoop === 100) {
        // this.proto.colourize(hasBeen, food);
        console.log("PATH NOT FOUND!");
        break;
      }
    }
    return;
  }
  this.getNearestFood = function ( objects ) {
    let deltaX = null;
    let deltaY = null;
    let temp = [];
    for (let food of objects.food) {
      deltaX = Math.abs(food.row - objects.head.row);
      deltaY = Math.abs(food.column - objects.head.column);
      temp.push(deltaX + deltaY);
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
  this.search = function(obj, map, direction, index) {
    this.update(obj, map);
    let objLocations = this.getAllObjectLocation();
    let nearestFoodCoordinate = this.getNearestFood(objLocations);
    let foundPath = this.findPathFromTo(
      objLocations.head, nearestFoodCoordinate, direction, index, obj.score
    );
    this.checkAroundMoves(foundPath, nearestFoodCoordinate);
    return this.proto.translate(foundPath, objLocations.head);
  }
}