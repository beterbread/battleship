function Ship(user_length = 0) {
    let length = user_length;
    let hits = 0;
    const hit = () => {
        hits++;
    }
    const isSunk = () => {
        if (length === hits) {
            return true;
        }
        else {
            return false;
        }
    }
    return { hit, isSunk }
}

function Gameboard() {
    let board = Array.from({ length: 10 }, () => Array(10).fill(0));
    let ships = [];

    const placeShip = (x, y, length, isVertical) => {
        if (x < 0 || y < 0 || x >= 10 || y >= 10) {
            return false;
        }
        if (!isVertical) {
            if (y + length > 10) {
                return false;
            }
        } else {
            if (x + length > 10) {
                return false;
            }
        }
        const ship = Ship(length);
        ships.push(ship);
        for (let i = 0; i < length; i++) {
            if (!isVertical) {
                if (board[y][i + x] !== 0) { return false; }
                board[y][i + x] = ship;
            } else {
                if (board[y][i + x] !== 0) { return false; }
                board[i + y][x] = ship;
            }
        }
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

    const allSunk = () => {
        return ships.every(ship => ship.isSunk());
    }

    const getGrid = () => {
        let grid = document.createElement('div');
        grid.classList.add('grid');
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let tile = document.createElement('div')
                tile.classList.add('tile');
                if (board[i][j] === 'missed') {
                    tile.classList.add('missed');
                }
                else if (board[i][j] === 'hit') {
                    tile.classList.add('hit');
                }
                else if (board[i][j] === 0) {
                    tile.classList.add('tile');
                }
                else {
                    tile.classList.add('ship');
                }
                grid.appendChild(tile);
            }
        }
        return grid;
    }

    const resetBoard = () => {
        board = Array.from({ length: 10 }, () => Array(10).fill(0));
    }

    return { placeShip, receiveAttack, allSunk, getGrid, resetBoard };
}

const Player = () => {
    const attack = (gameboard, x, y) => {
        gameboard.receiveAttack(x, y);
    };

    return { attack };
};

const ComputerPlayer = () => {
    let lastHit = null;

    const attackRandom = (gameboard) => {
        let x, y;

        if (lastHit) {
            const possibleMoves = getAdjacentMoves(lastHit);
            const legalMoves = possibleMoves.filter(move => isLegalMove(move, gameboard));

            if (legalMoves.length > 0) {
                const randomIndex = Math.floor(Math.random() * legalMoves.length);
                [x, y] = legalMoves[randomIndex];
            } else {

                [x, y] = getRandomMove(gameboard);
            }
        } else {
            [x, y] = getRandomMove(gameboard);
        }

        lastHit = [x, y];
        gameboard.receiveAttack(x, y);
    };

    const getRandomMove = (gameboard) => {
        let x, y;
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (!gameboard.receiveAttack(x, y));

        return [x, y];
    };

    const getAdjacentMoves = ([x, y]) => {
        return [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];
    };

    const isLegalMove = ([x, y], gameboard) => {
        return x >= 0 && x < 10 && y >= 0 && y < 10 && gameboard.receiveAttack(x, y);
    };

    return { attackRandom };
};

// Objects for main loop
let playerGB = Gameboard();
let compGB = Gameboard();
let player = Player();
let compPlayer = ComputerPlayer();

// Boards displayed
let pboard = document.querySelector('#pboard');
pboard.appendChild(playerGB.getGrid());
let cboard = document.querySelector('#cboard');
cboard.appendChild(compGB.getGrid());

// Logic for the popup form
let popup = document.querySelector('#popup');
let submit = document.querySelector('#formSubmit');
let error = document.querySelector('#error');
submit.addEventListener('click', function (event) {
    let lengths = [2, 3, 3, 4, 5];
    let coordinateElements = document.querySelectorAll('.coordinates');
    let err = true;
    coordinateElements.forEach(function (coordinateElement, index) {
        let x = coordinateElement.querySelector('input:nth-child(1)').value;
        let y = coordinateElement.querySelector('input:nth-child(2)').value;
        let vertical = coordinateElement.querySelector('input[type="checkbox"]').checked;
        let length = lengths[index];
        if (playerGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, length, vertical) === false) {
            err = false;
            return;
        }
    });
    if (err === true) {
        pboard.removeChild(pboard.firstChild);
        pboard.append(playerGB.getGrid());
        popup.style.display = "none";
    }
    else {
        playerGB.resetBoard();
        error.style.display = "block";
    }
});

module.exports = {
    Ship,
    Gameboard,
    Player,
    ComputerPlayer
};
