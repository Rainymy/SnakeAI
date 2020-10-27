const aStar = {
  Initial: {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  },
  
  mapGrid: null,
  mapArrayWithPosition: null,
  
  proto: {
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
  },
  Math: {
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
  },
  getInitialValues: function (obj) {
    return obj.isHead 
            ? this.Initial.HEAD : obj.isWall 
              ? this.Initial.WALL : obj.isFood 
                ? this.Initial.FOOD : this.Initial.AIR
  },
  convertGridToArray: function (list, walls, foods) {
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
  },
  createGridFromArray: function(lists) {
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
  },
  getWalkableNeighbours: function (head, walked) {
    walked = walked || [];
    let walkableNodes = [];
    let compareValues = [ this.Initial.AIR, this.Initial.FOOD ];
    
    let middleRow = this.mapGrid[head.row] || [];
    let leftRow = this.mapGrid[head.row - 1] || [];
    let rightRow = this.mapGrid[head.row + 1] || [];
    
    let top = leftRow[head.column];
    let bottom = rightRow[head.column];
    let left = middleRow[head.column - 1];
    let right = middleRow[head.column + 1];
    
    if (this.proto.compareValues(top, compareValues)){
      walkableNodes.push({ row: head.row - 1, column: head.column });
    }
    if (this.proto.compareValues(bottom, compareValues)){
      walkableNodes.push({ row: head.row + 1, column: head.column });
    }
    if (this.proto.compareValues(left, compareValues)) {
      walkableNodes.push({ row: head.row, column: head.column - 1 });
    }
    if (this.proto.compareValues(right, compareValues)) {
      walkableNodes.push({ row: head.row, column: head.column + 1 });
    }
    for (let [i, node] of walkableNodes.entries()) {
      for (let j = 0; j < walked.length; j++) {
        if (this.proto.isSameCoordinate(walked[j], node)) {
          walkableNodes.splice(i, 1);
          break;
        }
      }
    }
    // console.log(walkableNodes);
    return walkableNodes;
  },
  findPathFromTo: function (head, food) {
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
        let copy;
        let curr = currentNode;
        while (curr.parent) {
          ret.push(curr); 
          curr = curr.parent;
        }
        // this.proto.colourize(ret.map(v => Object.assign({}, v)).reverse());
        return ret.map(v => delete v.parent ? v : v).reverse();
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
      // Safety Break, do not comment this
      if (++totalLoop === 200) {
        console.log("PATH NOT FOUND!");
        this.proto.colourize(closedNode, { speed: 50 });
        break;
      }
    }
    return [];
  },
  getNearestFood: function ( objects ) {
    let temp = [];
    for (let food of objects.food) {
      temp.push(this.Math.heuristic(food, objects.head));
    }
    return objects.food[this.Math.getIndexWithLowestValue(temp)];
  },
  getAllObjectLocation: function (direction) {
    let obj = { head: [], food: [] };
    for (let [i, x] of this.mapGrid.entries()) {
      for (let [j, y] of x.entries()) {
        if (y === this.Initial.HEAD) {
          obj.head = { row: i, column: j, direction: direction.letter };
        }
        else if (y === this.Initial.FOOD) {
          obj.food.push({ row: i, column: j });
        }
      }
    }
    return obj;
  },
  search: function (obj, map) {
    this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
    this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
    
    let objLocations = this.getAllObjectLocation(obj.direction);
    let nearestFoodCoordinate = this.getNearestFood(objLocations);
    let foundPath = this.findPathFromTo(objLocations.head, nearestFoodCoordinate);
    console.log(objLocations);
    return this.proto.translate(foundPath, objLocations.head);
  }
}