function Ship(user_length = 0) {
    let length = user_length;
    let hits = 0;
    const hit = () => {
        hits++;
    }
    const isSunk = () => {
        return length === hits;
    };
    return { hit, isSunk }
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
        } else if (isVertical && checkBounds > 10) {
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

    const allSunk = () => {
        return ships.every(ship => ship.isSunk());
    }

    const getGrid = () => {
        let grid = document.createElement('div');
        grid.classList.add('grid');
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let tile = document.createElement('div');
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
                tile.setAttribute("id", i + " " + j);
                grid.appendChild(tile);
            }
        }
        return grid;
    };
    
    const resetBoard = () => {
        board = Array.from({ length: 10 }, () => Array(10).fill(0));
        ships = [];
    }

    const checkHit = (x, y) => {
        if (board[x][y] === 'hit' || board[x][y] === 'missed') {
            return false;
        }
        return true;
    }

    return { placeShip, receiveAttack, allSunk, getGrid, resetBoard, checkHit };
}

const Player = () => {
    const attack = (gameboard, x, y) => {
        gameboard.receiveAttack(x, y);
    };

    return { attack };
};

const ComputerPlayer = () => {
    const attack = (gameboard) => {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        while (gameboard.checkHit(x, y) === false) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }
        gameboard.receiveAttack(x, y);
    };

    return { attack };
};

// Logic for placing ships on computer's board
function initializeCompGB (cboard, compGB) {
    let x = Math.floor(Math.random() * 10) + 1;
    let y = Math.floor(Math.random() * 10) + 1;
    let coin = Math.floor(Math.random() * 2) + 1;
    let vertical = (coin === 1);
    let lengths = [2, 3, 3, 4, 5];
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

initializeCompGB (cboard, compGB)

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
        // Main game 
        // Define the event handler function
    const clickHandler = function(event) {
    const clickedTile = event.target;
    if (clickedTile.classList.contains('tile')) {
        let str1 = clickedTile.getAttribute("class");
        if (!str1.includes("missed") && !str1.includes("hit")) {
            let str2 = clickedTile.getAttribute("id");
            let coordinates = str2.split(" ");
            player.attack(compGB, parseInt(coordinates[0]), parseInt(coordinates[1]))  
            cboard.removeChild(cboard.firstChild);
            cboard.append(compGB.getGrid());
            compPlayer.attack(playerGB);
            pboard.removeChild(pboard.firstChild);
            pboard.append(playerGB.getGrid());
            // Check for winner
            let winPop = document.querySelector('.winPop');
            let winner = document.querySelector('.winner');
            if (compGB.allSunk() && playerGB.allSunk()) {
                winPop.style.display = 'block';
                winner.innerHTML = 'Tie';
            }
            else if (compGB.allSunk()) {
                winPop.style.display = 'block';
                winner.innerHTML = 'You win';
            }
            else if (playerGB.allSunk()) {
                winPop.style.display = 'block';
                winner.innerHTML = 'You lose';
            }
            // Reset game
            let again = document.querySelector('.again');
            again.addEventListener('click', () => {
                // Remove the event listener before resetting
                cboard.removeEventListener('click', clickHandler);
                
                playerGB.resetBoard();
                compGB.resetBoard();
                pboard.removeChild(pboard.firstChild);
                cboard.removeChild(cboard.firstChild);
                pboard.appendChild(playerGB.getGrid());
                cboard.appendChild(compGB.getGrid());
                initializeCompGB (cboard, compGB);
                popup.style.display = 'block';
                winPop.style.display = 'none';
            });
        }
    }
    };
    cboard.addEventListener('click', clickHandler);
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
