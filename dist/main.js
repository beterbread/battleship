/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module) => {

eval("function Ship(user_length = 0) {\n    let length = user_length;\n    let hits = 0;\n    const hit = () => {\n        hits++;\n    }\n    const isSunk = () => {\n        if (length === hits) { \n            return true; \n        }\n        else { \n            return false; \n        }\n    }\n    return { hit, isSunk }\n}\n\nfunction Gameboard() {\n    let board = Array.from({ length: 10 }, () => Array(10).fill(0));\n    let ships = [];\n    \n    const placeShip = (x, y, length, isVertical) => {\n        if (x < 0 || y < 0 || x >= 10 || y >= 10) {\n            return false;\n        }\n        if (!isVertical) {\n            if (y + length > 10) {\n                return false;\n            }\n        } else {\n            if (x + length > 10) {\n                return false;\n            }\n        }\n        const ship = Ship(length);\n        ships.push(ship); \n        for (let i = 0; i < length; i++) {\n            if (!isVertical) {\n                board[x][i + y] = ship;\n            } else {\n                board[i + x][y] = ship;\n            }\n        }\n    };\n\n    const receiveAttack = (x, y) => {\n        if (x < 0 || y < 0 || x >= 10 || y >= 10) {\n            return false;\n        }\n        if (board[x][y] === 'missed' || board[x][y] === 'hit') {\n            return false; \n        }\n        const ship = board[x][y];\n        if (ship) {\n            ship.hit();\n            board[x][y] = 'hit'; \n        } else {\n            board[x][y] = 'missed'; \n            return false;\n        }\n    };\n\n    const allSunk = () => {\n        return ships.every(ship => ship.isSunk());\n    }\n\n    const getGrid = () => {  \n        let grid = document.createElement('div');\n        grid.classList.add('grid');\n        for (let i = 0; i < 10; i++) {\n            for (let j = 0; j < 10; j++) {\n                let tile = document.createElement('div')\n                tile.classList.add('tile');\n                if (board[i][j] === 'missed') {\n                    tile.classList.add('missed');  \n                }\n                else if (board[i][j] === 'hit') {\n                    tile.classList.add('hit');  \n                }\n                else if (board[i][j] === 0) {\n                    tile.classList.add('tile');\n                }\n                else {\n                    tile.classList.add('ship');  \n                }\n                grid.appendChild(tile);\n            }\n        }\n        return grid;\n    }    \n\n    return { placeShip, receiveAttack, allSunk, getGrid };\n}\n\nconst Player = () => {\n    const attack = (gameboard, x, y) => {\n        gameboard.receiveAttack(x, y);\n    };\n\n    return { attack };\n};\n\nconst ComputerPlayer = () => {\n    let lastHit = null;\n\n    const attackRandom = (gameboard) => {\n        let x, y;\n\n        if (lastHit) {\n            const possibleMoves = getAdjacentMoves(lastHit);\n            const legalMoves = possibleMoves.filter(move => isLegalMove(move, gameboard));\n\n            if (legalMoves.length > 0) {\n                const randomIndex = Math.floor(Math.random() * legalMoves.length);\n                [x, y] = legalMoves[randomIndex];\n            } else {\n\n                [x, y] = getRandomMove(gameboard);\n            }\n        } else {\n            [x, y] = getRandomMove(gameboard);\n        }\n\n        lastHit = [x, y];\n        gameboard.receiveAttack(x, y);\n    };\n\n    const getRandomMove = (gameboard) => {\n        let x, y;\n        do {\n            x = Math.floor(Math.random() * 10);\n            y = Math.floor(Math.random() * 10);\n        } while (!gameboard.receiveAttack(x, y));\n\n        return [x, y];\n    };\n\n    const getAdjacentMoves = ([x, y]) => {\n        return [\n            [x - 1, y],\n            [x + 1, y],\n            [x, y - 1], \n            [x, y + 1]  \n        ];\n    };\n\n    const isLegalMove = ([x, y], gameboard) => {\n        return x >= 0 && x < 10 && y >= 0 && y < 10 && gameboard.receiveAttack(x, y);\n    };\n\n    return { attackRandom };\n};\n\n// Objects for main loop\nlet playerGB = Gameboard();\nlet compGB = Gameboard();\nlet player = Player();\nlet compPlayer = ComputerPlayer();\n\n// Boards displayed\nlet pboard = document.querySelector('#pboard');\npboard.appendChild(playerGB.getGrid());\nlet cboard = document.querySelector('#cboard');\ncboard.appendChild(compGB.getGrid());\n\n// Logic for the popup form\nlet popup = document.querySelector('#popup');\nlet submit = document.querySelector('#formSubmit');\nlet error = document.querySelector('#error');\nsubmit.addEventListener('click', function(event) {\n    let lengths = [2, 3, 3, 4, 5];\n    let coordinateElements = document.querySelectorAll('.coordinates');\n    let err = true;\n    coordinateElements.forEach(function (coordinateElement, index) {\n        let x = coordinateElement.querySelector('input:nth-child(1)').value;\n        let y = coordinateElement.querySelector('input:nth-child(2)').value;\n        let vertical = coordinateElement.querySelector('input[type=\"checkbox\"]').checked;\n        let length = lengths[index]; \n        if (playerGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, length, vertical) === false) {\n            err = false;\n            return;\n        }\n    });\n    if (err === true) {\n        pboard.removeChild(pboard.firstChild);\n        pboard.append(playerGB.getGrid());  \n        popup.style.display = \"none\";\n    }\n    else {\n        error.style.display = \"block\";\n    }\n    \n});\n\nmodule.exports = {\n    Ship,\n    Gameboard,\n    Player,\n    ComputerPlayer\n};\n\n\n//# sourceURL=webpack://webpack-demo/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;