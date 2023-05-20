import { playerMove, playerDown, playerRotate, playerDrop, togglePause, resetGame } from "./script.js"

export function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      playerMove(-1);
    } else if (event.key === "ArrowRight") {
      playerMove(1);
    } else if (event.key === "ArrowDown") {
      playerDown();
    } else if (event.key.toLowerCase() === "q") {
      playerRotate(-1); // CCW
    } else if (event.key.toLowerCase() === "w") {
      playerRotate(1); // CW
    } else if (event.key === "ArrowUp") {
      playerDrop();
    } else if (event.key.toLowerCase() === "e") {
      togglePause();
    } else if (event.key.toLowerCase() === "r") {
      resetGame();
    }
  }