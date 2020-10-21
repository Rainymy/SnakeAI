function pressHandler(event, direction) {
  if (event.key === "w" && direction.letter !== "s") {
    return { x: 0, y: -1, letter: "w" };
  }
  else if (event.key === "s" && direction.letter !== "w") {
    return { x: 0, y: 1, letter: "s" };
  }
  else if (event.key === "d" && direction.letter !== "a") {
    return { x: 1, y: 0, letter: "d" };
  }
  else if (event.key === "a" && direction.letter !== "d") {
    return { x: -1, y: 0, letter: "a" };
  }
  else if (event.key === "s" && direction.letter === "w") {
    return { x: 0, y: -1, letter: "w" };
  }
  else if (event.key === "w" && direction.letter === "w") {
    return { x: 0, y: 1, letter: "s" };
  }
  else if (event.key === "a" && direction.letter === "d") {
    return { x: 1, y: 0, letter: "d" };
  }
  else if (event.key === "d" && direction.letter === "a") {
    return { x: -1, y: 0, letter: "a" };
  }
  return null;
}