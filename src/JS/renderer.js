function propsObject(boxes) {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.totalBoxes = boxes || 1;
  this.boxPixel = this.canvas.width / this.totalBoxes;
  this.drawSqure = (x, y, size) => {
    this.ctx.beginPath();
    this.ctx.rect(x, y, size, size);
    this.ctx.stroke();
  };
  this.drawMap = () => {
    for (let i = 0; i < this.canvas.width/this.boxPixel; i++) {
      for (let j = 0; j < this.canvas.height/this.boxPixel; j++) {
        this.drawSqure(i * this.boxPixel, j * this.boxPixel, this.boxPixel);
      }
    }
  }
}
let totalRowBoxes = 99;
let game = new propsObject(totalRowBoxes);

game.drawMap()

console.log(game);
