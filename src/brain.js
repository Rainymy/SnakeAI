const buttons = [ "w", "a", "s", "d" ];
function makePrediction(snake) {
  let moves = aStar.search(currentSnake, manager.wholeMap) || [];
  if (!moves.length) {
    for (let i = 0; i < 2; i++) {
        moves.push(buttons[Math.floor(Math.random() * buttons.length)]);
      }
  }
  // console.count();
  return moves;
}