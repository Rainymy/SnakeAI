function propsObject() {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.drawSqure = (x, y, size) => {
    this.ctx.beginPath();
    this.ctx.rect(x, y, size, size);
    this.ctx.stroke();
  };
}
let game = new propsObject();

let totalBoxes = 20;
let boxPixel = game.canvas.width / totalBoxes;

for (let i = 0; i < game.canvas.width/boxPixel; i++) {
  for (let j = 0; j < game.canvas.height/boxPixel; j++) {
    game.drawSqure(i * boxPixel, j * boxPixel, boxPixel);
  }
}
console.log(boxPixel);
console.log(game);
