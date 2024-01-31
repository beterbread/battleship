function Ship(user_length = 0) {
  const length = user_length;
  let hits = 0;
  const hit = () => {
    hits++;
  };
  const isSunk = () => length === hits;
  return { hit, isSunk };
}

function Gameboard() {
  let board = Array.from({ length: 10 }, () => Array(10).fill(0));
  let ships = [];

  const placeShip = (x, y, length, isVertical) => {
    if (x < 0 || y < 0 || x >= 10 || y >= 10) {
      return false;
    }
    const checkBounds = isVertical ? y + length : x + length;
    if (!isVertical && checkBounds > 10) {
      return false;
    } if (isVertical && checkBounds > 10) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const currentX = isVertical ? x : i + x;
      const currentY = isVertical ? i + y : y;
      if (board[currentY][currentX] !== 0) {
        return false;
      }
    }
    const ship = Ship(length);
    ships.push(ship);
    for (let i = 0; i < length; i++) {
      const currentX = isVertical ? x : i + x;
      const currentY = isVertical ? i + y : y;
      board[currentY][currentX] = ship;
    }

    return true;
  };

  const receiveAttack = (x, y) => {
    if (x < 0 || y < 0 || x >= 10 || y >= 10) {
      return false;
    }
    if (board[x][y] === 'missed' || board[x][y] === 'hit') {
      return false;
    }
    const ship = board[x][y];
    if (ship) {
      ship.hit();
      board[x][y] = 'hit';
    } else {
      board[x][y] = 'missed';
      return false;
    }
  };

  const allSunk = () => ships.every((ship) => ship.isSunk());

  const getGrid = () => {
    const grid = document.createElement('div');
    grid.classList.add('grid');
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        const currentCell = board[i][j];
        if (currentCell === 'missed') {
          tile.classList.add('missed');
        } else if (currentCell === 'hit') {
          tile.classList.add('hit');
        } else if (currentCell === 0) {
          tile.classList.add('tile');
        } else {
          tile.classList.add('ship');
        }
        tile.setAttribute('id', `${i} ${j}`);
        grid.appendChild(tile);
      }
    }
    return grid;
  };

  const resetBoard = () => {
    board = Array.from({ length: 10 }, () => Array(10).fill(0));
    ships = [];
  };

  const checkHit = (x, y) => {
    if (board[x][y] === 'hit' || board[x][y] === 'missed') {
      return false;
    }
    return true;
  };

  const compSink = (x, y) => {
    if (board[x][y] === 'hit') {
      return true;
    }
    return false;
  }

  return {
    placeShip, receiveAttack, allSunk, getGrid, resetBoard, checkHit, compSink
  };
}

const Player = () => {
  const attack = (gameboard, x, y) => {
    gameboard.receiveAttack(x, y);
  };

  return { attack };
};

let hitShips = new Set(); // Global variable for computer

const ComputerPlayer = () => {
  const attack = (gameboard) => {
    let check = false;  // Checks if there is adjacent squares to hit
    if (hitShips.size !== 0) {
      let check2 = false; // Checks if there is no adjacent square for coordinate
      outerLoop: for (const coordinates of hitShips) {
        const [x, y] = coordinates.split(' ').map(Number);
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
          for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const adjacentX = x + xOffset;
            const adjacentY = y + yOffset;
            if (
              adjacentX >= 0 && adjacentX < 10 &&
              adjacentY >= 0 && adjacentY < 10
            ) {
              if (!hitShips.has(adjacentX + ' ' + adjacentY)) {
                // Perform an attack on the adjacent position
                if (gameboard.checkHit(adjacentX, adjacentY) === true) {
                  gameboard.receiveAttack(adjacentX, adjacentY);
                  if (gameboard.compSink(adjacentX, adjacentY)) {
                    hitShips.add(adjacentX + " " + adjacentY);
                  }
                  check = true;
                  check2 = true;
                  break outerLoop;
                }
              }
            }
          }
        }
        if (check2 === false) { // Removes ship if there is no adjacent squares to attack
          hitShips.delete(x + " " + y);
        }
        else {
          check2 = false;
        }
      }
    }
    if (check === false) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      while (gameboard.checkHit(x, y) === false) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
      gameboard.receiveAttack(x, y);
      if (gameboard.compSink(x, y)) {
        hitShips.add(x + " " + y);
      }
    }
  };

  return { attack };
};

// Logic for placing ships on computer's board
function initializeCompGB(cboard, compGB) {
  let x = Math.floor(Math.random() * 10) + 1;
  let y = Math.floor(Math.random() * 10) + 1;
  let coin = Math.floor(Math.random() * 2) + 1;
  let vertical = (coin === 1);
  const lengths = [2, 3, 3, 4, 5];
  for (let i = 0; i < 5; i++) {
    while (compGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, lengths[i], vertical) === false) {
      x = Math.floor(Math.random() * 10) + 1;
      y = Math.floor(Math.random() * 10) + 1;
      coin = Math.floor(Math.random() * 2) + 1;
      vertical = (coin === 1);
    }
  }
  cboard.removeChild(cboard.firstChild);
  cboard.append(compGB.getGrid());
}

function showModalOverlay() {
  document.getElementById('modalOverlay').classList.add('active');
}

function hideModalOverlay() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// Objects for main loop
const playerGB = Gameboard();
const compGB = Gameboard();
const player = Player();
const compPlayer = ComputerPlayer();

// Boards displayed
const pboard = document.querySelector('#pboard');
pboard.appendChild(playerGB.getGrid());
const cboard = document.querySelector('#cboard');
cboard.appendChild(compGB.getGrid());

initializeCompGB(cboard, compGB);
showModalOverlay();

// Logic for the popup form
const popup = document.querySelector('#popup');
const submit = document.querySelector('#formSubmit');
const error = document.querySelector('#error');
const popTitle = document.querySelector('.popTitle');
let lengths = [2, 3, 3, 4, 5];
submit.addEventListener('click', (event) => {
  const x = document.querySelector('.xCord').value;
  const y = document.querySelector('.yCord').value;
  const vertical = document.querySelector('input[type="checkbox"]').checked;
  const length = lengths[0];
  if (playerGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, length, vertical) === false) {
    error.style.display = 'block';
  }
  else {
    error.style.display = 'none';
    pboard.removeChild(pboard.firstChild);
    pboard.append(playerGB.getGrid());
    lengths.shift();
    popTitle.innerHTML = 'Ship of length ' + lengths[0];
    document.querySelector('.xCord').value = '';
    document.querySelector('.yCord').value = '';
  }
  if (lengths.length === 0) {
    lengths = [2, 3, 3, 4, 5];
    hideModalOverlay();
    pboard.removeChild(pboard.firstChild);
    pboard.append(playerGB.getGrid());
    popup.style.display = 'none';
    // Main game
    // Define the event handler function
    const clickHandler = function (event) {
      const clickedTile = event.target;
      if (clickedTile.classList.contains('tile')) {
        const str1 = clickedTile.getAttribute('class');
        if (!str1.includes('missed') && !str1.includes('hit')) {
          const str2 = clickedTile.getAttribute('id');
          const coordinates = str2.split(' ');
          player.attack(compGB, parseInt(coordinates[0]), parseInt(coordinates[1]));
          cboard.removeChild(cboard.firstChild);
          cboard.append(compGB.getGrid());
          compPlayer.attack(playerGB);
          pboard.removeChild(pboard.firstChild);
          pboard.append(playerGB.getGrid());
          // Check for winner
          const winPop = document.querySelector('.winPop');
          const winner = document.querySelector('.winner');
          if (compGB.allSunk() && playerGB.allSunk()) {
            winPop.style.display = 'block';
            winner.innerHTML = 'Tied game!';
            showModalOverlay();
          } else if (compGB.allSunk()) {
            winPop.style.display = 'block';
            winner.innerHTML = 'You win!';
            showModalOverlay();
          } else if (playerGB.allSunk()) {
            winPop.style.display = 'block';
            winner.innerHTML = 'You lose!';
            showModalOverlay();
          }
          // Reset game
          const again = document.querySelector('.again');
          again.addEventListener('click', () => {
            hitShips = new Set(); //Reset hit ships for bot
            // Remove the event listener before resetting
            cboard.removeEventListener('click', clickHandler);
            playerGB.resetBoard();
            compGB.resetBoard();
            pboard.removeChild(pboard.firstChild);
            cboard.removeChild(cboard.firstChild);
            pboard.appendChild(playerGB.getGrid());
            cboard.appendChild(compGB.getGrid());
            initializeCompGB(cboard, compGB);
            popup.style.display = 'block';
            winPop.style.display = 'none';
          });
        }
      }
    };
    cboard.addEventListener('click', clickHandler);
  } 
});

module.exports = {
  Ship,
  Gameboard,
  Player,
  ComputerPlayer,
};
