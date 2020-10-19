const buttons = [ "w", "a", "s", "d" ];
function makePrediction(snake, direction) {
  let moves = aStar.search(currentSnake, manager.wholeMap, direction) || [];
  if (!moves.length) {
    for (let i = 0; i < 2; i++) {
        moves.push(buttons[Math.floor(Math.random() * buttons.length)]);
      }
  }
  // console.count();
  return moves;
}