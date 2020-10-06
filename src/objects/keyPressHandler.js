function pressHandler(event, loopObj={ index: 0 }) {
  let obj = snakes[loopObj.index];
  if (event.key === "w" && obj.direction.letter !== "s") {
    obj.pressQueue.push({ x: 0, y: -1, letter: "w" });
  }
  else if (event.key === "s" && obj.direction.letter !== "w") {
    obj.pressQueue.push({ x: 0, y: 1, letter: "s" });
  }
  else if (event.key === "d" && obj.direction.letter !== "a") {
    obj.pressQueue.push({ x: 1, y: 0, letter: "d" });
  }
  else if (event.key === "a" && obj.direction.letter !== "d") {
    obj.pressQueue.push({ x: -1, y: 0, letter: "a" });
  }
  // // If you press opposite direction of the player
  else if (event.key === "w" && obj.direction.letter === "s") {
    obj.pressQueue.push({ x: 0, y: 1, letter: "s" });
  }
  else if (event.key === "s" && obj.direction.letter === "w") {
    obj.pressQueue.push({ x: 0, y: -1, letter: "w" });
  }
  else if (event.key === "d" && obj.direction.letter === "a") {
    obj.pressQueue.push({ x: -1, y: 0, letter: "a" });
  }
  else if (event.key === "a" && obj.direction.letter === "d") {
    obj.pressQueue.push({ x: 1, y: 0, letter: "d" });
  }
  return null;
}