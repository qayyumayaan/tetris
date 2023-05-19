
// Define an array of random colors for each block
export const colors = [
    null,           // Empty block
    'purple',       // Color for I-block
    'yellow',       // Color for L-block
    'orange',       // Color for J-block
    'blue',         // Color for O-block
    'aqua',         // Color for T-block
    'green',        // Color for S-block
    'red',          // Color for Z-block
  ];


export function createPiece(type) {
    if (type === 'I') {
      return [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else if (type === 'L') {
      return [
        [0, 0, 0],
        [2, 2, 2],
        [2, 0, 0],
      ];
    } else if (type === 'J') {
      return [
        [0, 0, 0],
        [3, 3, 3],
        [0, 0, 3],
      ];
    } else if (type === 'O') {
      return [
        [4, 4],
        [4, 4],
      ];
    } else if (type === 'T') {
      return [
        [0, 0, 0],
        [5, 5, 5],
        [0, 5, 0],
      ];
    } else if (type === 'S') {
      return [
        [0, 0, 0],
        [0, 6, 6],
        [6, 6, 0],
      ];
    } else if (type === 'Z') {
      return [
        [0, 0, 0],
        [7, 7, 0],
        [0, 7, 7],
      ];
    }
  }