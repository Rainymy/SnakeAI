function snakeObjects(boxSize, totalBoxes) {
  this.getRandomLocation = function () {
    return Math.floor(Math.random() * totalBoxes) * boxSize;
  }
  console.log(totalBoxes);
  // this.getRandomAvailableLocation = (repeated=totalBoxes**2) => {
  //   if (repeated < 0) {
  //     return { x: -1, y: -1, coordinate: null };
  //   }
  //   let xL = this.getRandomLocation();
  //   let yL = this.getRandomLocation();
  //   for (let body of this.bodies) {
  //     if (xL !== body.x && yL !== body.y) {
  //       return { x: xL, y: yL, coordinate: [ xL, yL ] }
  //     }
  //   }
  //   return this.getRandomAvailableLocation(repeated - 1);
  // }
  
  
  // this.getRandomAvailableLocation = () => {
  //   let avaible = [];
  //   for (let i = 0; i < totalBoxes; i++) {
  //     if (bodies[i] === ) {
  //       let place = { x: i * boxSize, y: null };
  //       for (let j = 0; j < totalBoxes; j++) {
  //         console.log(j * boxSize);
  //       }
  //     }
  //   }
  // }
  this.x = this.getRandomLocation();
  this.y = this.getRandomLocation();
  this.score = 0;
  this.pressQueue = [];
  this.bodies = [
    {
      x: this.x, 
      y: this.y
    }
  ];
  this.foods = [
    {
      x: this.getRandomLocation(),
      y: this.getRandomLocation()
    },
    {
      x: this.getRandomLocation(),
      y: this.getRandomLocation()
    }
  ];
  this.direction = { x: 0, y: 0, letter: null };
}