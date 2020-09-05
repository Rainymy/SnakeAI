const moves = [ "w", "a", "s", "d" ]
function makePrediction() {
  return { key: moves[Math.floor(Math.random() * moves.length)] };
}