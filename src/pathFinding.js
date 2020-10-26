const aStar = new function Star() {
  "use strict";
  const Initial = {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  };
  
  this.mapGrid = null;
  this.mapArrayWithPosition = null;
  
  this.proto = {
    lastElement: function (array) {
      return array[array.length - 1];
    },
    isSameCoordinate: function (startPos, endPos) {
      if (!endPos || !startPos) {
        console.error("Missing end/start position"); 
        return false;
      }
      
      let endX = endPos[ endPos.hasOwnProperty("x") ? "x": "row" ];
      let endY = endPos[ endPos.hasOwnProperty("y") ? "y": "column" ];
      let startX = startPos[ startPos.hasOwnProperty("x") ? "x": "row" ];
      let startY = startPos[ startPos.hasOwnProperty("y") ? "y": "column" ];
      
      return startX === endX && startY === endY;
    },
    getOpposite: function (direction) {
      return direction === "w"
              ? "s" : direction === "s"
                ? "w" : direction === "a"
                  ? "d" : direction === "d"
                    ? "a" : undefined;
    },
    getObjectArray: function(options, defaultValue) {
      return Object.assign({
        isWall: false,
        isFood: false,
        isHead: false
      }, options, defaultValue);
    },
    colourize: function (array, flag) {
      let copy = array.slice();
      for (let [i, per] of copy.entries()) {
        gameBoard.colourize(per,i === copy.length - 1 ? true: false, flag && flag.speed);
      }
    },
    compareValues: function (firstValue, array) {
      if (firstValue == undefined) { return false; }
      for (let value of array) { if (firstValue === value) { return true; }}
      return false;
    },
    translate: function (instructions, startPos) {
      let keyPressOrder = [];
      let last = startPos;
      for (let instruction of instructions) {
        if (0 > last.row - instruction.row) { keyPressOrder.push("d"); }
        else if (0 < last.row - instruction.row) { keyPressOrder.push("a"); }
        else if (0 > last.column - instruction.column) { keyPressOrder.push("s"); }
        else if (0 < last.column - instruction.column) { keyPressOrder.push("w"); }
        last = instruction;
      }
      return keyPressOrder;
    }
  }
  this.Math = {
    heuristic: function (start, end) {
      return Math.abs(end.row - start.row) + Math.abs(end.column - start.column);
    },
    getIndexWithLowestValue: function (array) {
      let index = 0;
      let lowest = 0;
      // go through the array and pick the first index then compare
      // the first and second value, if second is lower then pick second
      while (index++ < array.length) {
        if (array[lowest] > array[index]) {
          lowest = index;
        }
      }
      return lowest;
    },
    getLowestCostTile: function (array, endPos) {
      let temp = [];
      for (let middle of array) {
        temp.push(this.heuristic(middle, endPos));
      }
      return array[this.getIndexWithLowestValue(temp)];
    }
  }
  this.getInitialValues = function (obj) {
    return obj.isHead 
            ? Initial.HEAD : obj.isWall 
              ? Initial.WALL : obj.isFood 
                ? Initial.FOOD : Initial.AIR
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
    let grid = [], last;
    for (let current of lists) {
      for (let obj of current) {
        if (!last || last.x !== obj.x) {
          last = obj;
          grid.push([]);
        }
        this.proto.lastElement(grid).push(this.getInitialValues(obj));
      }
    }
    return grid;
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
    // console.log([...walkableNodes]);
    return [...walkableNodes];
  }
  this.findPathFromTo = function (head, food) {
    let closedNode = [];
    let openNode = [head];
    
    let currentNode;
    let totalLoop = 0;
    let dfg;
    
    while (openNode.length) {
      currentNode = this.Math.getLowestCostTile(openNode, food);
      // currentNode.direction = head.direction;
      if (this.proto.isSameCoordinate(currentNode, food)) {
        console.log("PATH FOUND");
        let ret = [];
        let curr = currentNode;
        while (curr.parent) {
          ret.push(curr); 
          curr = curr.parent;
        }
        // this.proto.colourize([...ret].reverse());
        return ret.reverse();
      }
      closedNode.push(...openNode.splice(openNode.indexOf(currentNode), 1));
      for (let neighbour of this.getWalkableNeighbours(currentNode, closedNode)) {
        dfg = this.proto.getOpposite(this.proto.translate([neighbour], currentNode)[0]);
        if (currentNode.direction === dfg) { continue; }
        if (-1 === openNode.indexOf(neighbour)) {
          neighbour.parent = currentNode;
          neighbour.direction = this.proto.translate([neighbour], currentNode).join();
          openNode.push(neighbour);
        }
      }
      // Safety Break, don't comment it
      if (++totalLoop === 200) {
        console.log("PATH NOT FOUND!");
        this.proto.colourize(closedNode, { speed: 50 });
        break;
      }
    }
    return [];
  }
  this.getNearestFood = function ( objects ) {
    let temp = [];
    for (let food of objects.food) {
      temp.push(this.Math.heuristic(food, objects.head));
    }
    return objects.food[this.Math.getIndexWithLowestValue(temp)];
  }
  this.getAllObjectLocation = function(direction) {
    let obj = { head: [], food: [] };
    for (let [i, x] of this.mapGrid.entries()) {
      for (let [j, y] of x.entries()) {
        if (y === Initial.HEAD) {
          obj.head = { row: i, column: j, direction: direction.letter };
        }
        else if (y === Initial.FOOD) {
          obj.food.push({ row: i, column: j });
        }
      }
    }
    return obj;
  }
  this.search = function(obj, map, direction) {
    this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
    this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
    
    let objLocations = this.getAllObjectLocation(direction);
    let nearestFoodCoordinate = this.getNearestFood(objLocations);
    let foundPath = this.findPathFromTo(objLocations.head, nearestFoodCoordinate);
    // console.log(this.proto.translate(foundPath, objLocations.head));
    return this.proto.translate(foundPath, objLocations.head);
  }
}