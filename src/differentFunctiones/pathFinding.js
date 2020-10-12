const aStar = new function () {
  const Initial = {
    FOOD: -1,
    WALL: 1,
    HEAD: 2,
    AIR: 0
  }
  this.mapGrid = null;
  this.mapArrayWithPosition = null;
  this.convertGridToArray = function(list, walls, foods) {
    let grid = [];
    let last = null;
    outer: for (let [index, current] of list.entries()) {
      if (!last || current.x !== last.x) {
        last = current;
        grid.push([]);
      }
      for (let [k, food] of foods.entries()) {
        if (food.x === current.x && food.y === current.y) {
          if (k === 1) {
            grid[grid.length - 1].push(
              Object.assign({
                isWall: false,
                isFood: true,
                isHead: true
              }, current)
            );
          }
          else {
            grid[grid.length - 1].push(
              Object.assign({
                isWall: false, 
                isFood: true,
                isHead: false 
              }, current)
            );
          }
          continue outer;
        }
      }
      for (let [j, wall] of walls.entries()) {
        if (j !== 0 && wall.x === current.x && wall.y === current.y) {
          grid[grid.length - 1].push(
            Object.assign({
              isWall: true,
              isFood: false,
              isHead: false 
            }, current)
          );
          continue outer;
        }
      }
      grid[grid.length - 1].push(
        Object.assign({
          isWall: false, 
          isFood: false,
          isHead: false 
        }, current)
      )
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
        
        if (obj.isHead) {
          grid[grid.length - 1].push(Initial.HEAD);
        } 
        else if (obj.isWall) {
          grid[grid.length - 1].push(Initial.WALL);
        } 
        else if (obj.isFood) {
          grid[grid.length - 1].push(Initial.FOOD);
        } 
        else {
          grid[grid.length - 1].push(Initial.AIR);
        }
      }
    }
    return grid;
  }
  this.findPathFromTo = function (snakeHead, food) {
    return null;
  }
  this.search = function(obj, map) {
    if (!this.mapGrid) {
      let start = performance.now();
      this.mapArrayWithPosition = this.convertGridToArray(map, obj.bodies, obj.foods);
      this.mapGrid = this.createGridFromArray(this.mapArrayWithPosition);
    }
    console.log(this.mapGrid);
  }
}

