import { colors, createPiece, createMatrix } from "./pieces.js";
import { scale, matrixWidth, matrixHeight, player } from "./config.js";

export const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

canvas.width = matrixWidth * scale;
canvas.height = matrixHeight * scale;

var slider = document.getElementById("difficultySlider");
var sliderValue = slider.value;

let dropInterval = 1000 / sliderValue; // milliseconds basically

var label = document.querySelector('label[for="difficultySlider"]');
label.innerText = "Level 1: "

function handleSliderChange() {
  // Read the updated value from the slider
  var slider = document.getElementById("difficultySlider");
  var sliderValue = slider.value;

  // Update the label with the slider value
  var label = document.querySelector('label[for="difficultySlider"]');
  label.innerText = "Level " + sliderValue + ": ";

  // Update the dropInterval value
  dropInterval = 1000 / sliderValue;
}


slider.addEventListener("input", handleSliderChange);

context.scale(scale, scale);


function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        // Assign a random color to each block
        const color = colors[value];
        context.fillStyle = color;
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}


function merge(matrix, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        matrix[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(matrix, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (matrix[y + o.y] &&
        matrix[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerDown() {
  player.pos.y++;
  if (collide(matrix, player)) {
    player.pos.y--;
    merge(matrix, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerDrop() {
  while (!collide(matrix, player)) {
    player.pos.y++;
  }
  player.pos.y--;
  merge(matrix, player);
  playerReset();
  arenaSweep();
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(matrix, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = Math.floor(matrix[0].length / 2) -
    Math.floor(player.matrix[0].length / 2);
  if (collide(matrix, player)) {
    matrix.forEach(row => row.fill(0));
  }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
  
    while (collide(matrix, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
  
      if (offset > player.matrix[0].length) {
        rotate(player.matrix, -dir);
        player.pos.x = pos;
        return;
      }
    }
  }  

let dropCounter = 0;

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDown();
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(matrix, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

document.addEventListener('keydown', event => {
  if (event.key === "ArrowLeft") {
    playerMove(-1);
  } else if (event.key === "ArrowRight") {
    playerMove(1); 
  } else if (event.key === "ArrowDown") {
    playerDown();
  } else if (event.key.toLowerCase() === "q") {
    playerRotate(-1); 
  } else if (event.key.toLowerCase() === "w" ) {
    playerRotate(1); // W key (clockwise)
  } else if (event.key === "ArrowUp") {
    // Up arrow key: Drop the piece to the lowest position
    playerDrop()
  }
});


function arenaSweep() {
  outer: for (let y = matrix.length - 1; y > 0; --y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (matrix[y][x] === 0) {
        continue outer;
      }
    }
    const row = matrix.splice(y, 1)[0].fill(0);
    matrix.unshift(row);
    y++;

    player.score += 10;
    player.lines++;

    if (player.lines % 10 === 0) {
      // Increase the speed of the game every 10 cleared lines
      dropInterval -= 100;
    }
  }
}

const matrix = createMatrix(matrixWidth, matrixHeight);



playerReset();
update();

document.getElementById('move-left').addEventListener('click', () => {
  playerMove(-1);
});

document.getElementById('move-right').addEventListener('click', () => {
  playerMove(1);
});

document.getElementById('rotate-left').addEventListener('click', () => {
  playerRotate(-1);
});

document.getElementById('rotate-right').addEventListener('click', () => {
  playerRotate(1);
});

document.getElementById('move-down').addEventListener('click', () => {
  playerDown();
});

document.getElementById('drop').addEventListener('click', () => {
  playerDrop();
});
