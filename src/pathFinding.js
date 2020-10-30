const aStar = {
  Initial: {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  },
  
  mapGrid: null,
  mapArray: null,
  
  proto: {
    init: false ,
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
    compareValues: function (firstValue, array) {
      if (firstValue == undefined) { return false; }
      for (let value of array) { if (firstValue === value) { return true; }}
      return false;
    },
    colourize: function (array, flag) {
      for (let [i, per] of array.entries()) {
        gameBoard.colourize(per,i === array.length - 1 ?true: false, flag && flag.speed);
      }
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
            this.lastElement(grid).push(this.getObjectArray({ isFood: true }, current));
            continue outer;
          }
        }
        for (let [j, wall] of walls.entries()) {
          if (j !== 0 && this.isSameCoordinate(wall, current)) {
            this.lastElement(grid).push(
              this.getObjectArray(j === 1 ? {isHead: true}: {isWall: true}, current)
            );
            continue outer;
          }
        }
        this.lastElement(grid).push(this.getObjectArray(current));
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
          this.lastElement(grid).push(this.getInitialValues(obj));
        }
      }
      return grid;
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
    getInitialValues: function (obj) {
      return obj.isHead 
              ? this.parent.Initial.HEAD : obj.isWall 
                ? this.parent.Initial.WALL : obj.isFood 
                  ? this.parent.Initial.FOOD : this.parent.Initial.AIR
    },
    getNearestFood: function ( objects ) {
      let temp = [];
      for (let food of objects.food) {
        temp.push(this.parent.Math.heuristic(food, objects.head));
      }
      return objects.food[this.parent.Math.getIndexWithLowestValue(temp)];
    },
    getAllObjectLocation: function (direction) {
      let obj = { head: [], food: [] };
      for (let [i, x] of this.parent.mapGrid.entries()) {
        for (let [j, y] of x.entries()) {
          if (y === this.parent.Initial.HEAD) {
            obj.head = { row: i, column: j, direction: direction.letter };
          }
          else if (y === this.parent.Initial.FOOD) {
            obj.food.push({ row: i, column: j });
          }
        }
      }
      return obj;
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
    },
    lastElement: function (array) {
      return array[array.length - 1];
    }
  },
  Math: {
    heuristic: function (start, end) {
      return Math.abs(end.row - start.row) + Math.abs(end.column - start.column);
    },
    getIndexWithLowestValue: function (array) {
      let index = 0;
      let lowest = 0;
      
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
    let direction;
    
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
        // this.proto.colourize(ret.map(v => Object.assign({}, v)).reverse());
        return ret.map(v => delete v.parent ? v : v).reverse();
      }
      closedNode.push(...openNode.splice(openNode.indexOf(currentNode), 1));
      for (let neighbour of this.getWalkableNeighbours(currentNode, closedNode)) {
        direction = this.proto.translate([neighbour], currentNode)[0];
        if (currentNode.direction === this.proto.getOpposite(direction)) { continue; }
        if (-1 === openNode.indexOf(neighbour)) {
          neighbour.parent = currentNode;
          neighbour.direction = direction;
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
  search: function (obj, map) {
    if (!this.proto.init) {
      this.proto.parent = this;
      this.proto.init = true;
    }
    
    this.mapArray = this.proto.convertGridToArray(map, obj.bodies,obj.foods);
    this.mapGrid = this.proto.createGridFromArray(this.mapArray);
    
    let objLocations = this.proto.getAllObjectLocation(obj.direction);
    let foundPath = this.findPathFromTo(
      objLocations.head, this.proto.getNearestFood(objLocations)
    );
    // console.log(objLocations);
    return this.proto.translate(foundPath, objLocations.head);
  }
}