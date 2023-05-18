const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scale = 20;

context.scale(scale, scale);

function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

// Define an array of random colors for each block
const colors = [
  null,           // Empty block
  'purple',       // Color for I-block
  'yellow',       // Color for L-block
  'orange',       // Color for J-block
  'blue',         // Color for O-block
  'aqua',         // Color for T-block
  'green',        // Color for S-block
  'red',          // Color for Z-block
];

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

function playerDrop() {
  player.pos.y++;
  if (collide(matrix, player)) {
    player.pos.y--;
    merge(matrix, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
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
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
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
  if (event.keyCode === 37) {
    playerMove(-1); // Left arrow key
  } else if (event.keyCode === 39) {
    playerMove(1); // Right arrow key
  } else if (event.keyCode === 40) {
    playerDrop(); // Down arrow key
  } else if (event.keyCode === 81) {
    playerRotate(-1); // Q key (counter-clockwise)
  } else if (event.keyCode === 87) {
    playerRotate(1); // W key (clockwise)
  }
});

// const colors = [
//   null,
//   'purple',
//   'yellow',
//   'orange',
//   'blue',
//   'aqua',
//   'green',
//   'red',
// ];

function createPiece(type) {
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

const matrix = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
  lines: 0,
};

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
  playerDrop();
});