import { playerMove, playerDown, playerRotate, playerDrop } from "./script.js"

export function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      playerMove(-1);
    } else if (event.key === "ArrowRight") {
      playerMove(1);
    } else if (event.key === "ArrowDown") {
      playerDown();
    } else if (event.key.toLowerCase() === "q") {
      playerRotate(-1);
    } else if (event.key.toLowerCase() === "w") {
      playerRotate(1); // W key (clockwise)
    } else if (event.key === "ArrowUp") {
      // Up arrow key: Drop the piece to the lowest position
      playerDrop();
    }
  }