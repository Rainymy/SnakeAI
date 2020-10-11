const buttons = [ "w", "a", "s", "d" ];
function makePrediction(snake) {
  let moves = [];
  // aStar.search(currentSnake, manager.wholeMap);
  for (let i = 0; i < 2; i++) {
    moves.push({ key: buttons[Math.floor(Math.random() * buttons.length)] });
  }
  return moves;
}