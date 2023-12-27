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

eval("function Ship(user_length = 0) {\n  const length = user_length;\n  let hits = 0;\n  const hit = () => {\n    hits++;\n  };\n  const isSunk = () => length === hits;\n  return { hit, isSunk };\n}\n\nfunction Gameboard() {\n  let board = Array.from({ length: 10 }, () => Array(10).fill(0));\n  let ships = [];\n\n  const placeShip = (x, y, length, isVertical) => {\n    if (x < 0 || y < 0 || x >= 10 || y >= 10) {\n      return false;\n    }\n    const checkBounds = isVertical ? y + length : x + length;\n    if (!isVertical && checkBounds > 10) {\n      return false;\n    } if (isVertical && checkBounds > 10) {\n      return false;\n    }\n    for (let i = 0; i < length; i++) {\n      const currentX = isVertical ? x : i + x;\n      const currentY = isVertical ? i + y : y;\n      if (board[currentY][currentX] !== 0) {\n        return false;\n      }\n    }\n    const ship = Ship(length);\n    ships.push(ship);\n    for (let i = 0; i < length; i++) {\n      const currentX = isVertical ? x : i + x;\n      const currentY = isVertical ? i + y : y;\n      board[currentY][currentX] = ship;\n    }\n\n    return true;\n  };\n\n  const receiveAttack = (x, y) => {\n    if (x < 0 || y < 0 || x >= 10 || y >= 10) {\n      return false;\n    }\n    if (board[x][y] === 'missed' || board[x][y] === 'hit') {\n      return false;\n    }\n    const ship = board[x][y];\n    if (ship) {\n      ship.hit();\n      board[x][y] = 'hit';\n    } else {\n      board[x][y] = 'missed';\n      return false;\n    }\n  };\n\n  const allSunk = () => ships.every((ship) => ship.isSunk());\n\n  const getGrid = () => {\n    const grid = document.createElement('div');\n    grid.classList.add('grid');\n    for (let i = 0; i < 10; i++) {\n      for (let j = 0; j < 10; j++) {\n        const tile = document.createElement('div');\n        tile.classList.add('tile');\n        const currentCell = board[i][j];\n        if (currentCell === 'missed') {\n          tile.classList.add('missed');\n        } else if (currentCell === 'hit') {\n          tile.classList.add('hit');\n        } else if (currentCell === 0) {\n          tile.classList.add('tile');\n        } else {\n          tile.classList.add('ship');\n        }\n        tile.setAttribute('id', `${i} ${j}`);\n        grid.appendChild(tile);\n      }\n    }\n    return grid;\n  };\n\n  const resetBoard = () => {\n    board = Array.from({ length: 10 }, () => Array(10).fill(0));\n    ships = [];\n  };\n\n  const checkHit = (x, y) => {\n    if (board[x][y] === 'hit' || board[x][y] === 'missed') {\n      return false;\n    }\n    return true;\n  };\n\n  return {\n    placeShip, receiveAttack, allSunk, getGrid, resetBoard, checkHit,\n  };\n}\n\nconst Player = () => {\n  const attack = (gameboard, x, y) => {\n    gameboard.receiveAttack(x, y);\n  };\n\n  return { attack };\n};\n\nconst ComputerPlayer = () => {\n  const attack = (gameboard) => {\n    let x = Math.floor(Math.random() * 10);\n    let y = Math.floor(Math.random() * 10);\n    while (gameboard.checkHit(x, y) === false) {\n      x = Math.floor(Math.random() * 10);\n      y = Math.floor(Math.random() * 10);\n    }\n    gameboard.receiveAttack(x, y);\n  };\n\n  return { attack };\n};\n\n// Logic for placing ships on computer's board\nfunction initializeCompGB(cboard, compGB) {\n  let x = Math.floor(Math.random() * 10) + 1;\n  let y = Math.floor(Math.random() * 10) + 1;\n  let coin = Math.floor(Math.random() * 2) + 1;\n  let vertical = (coin === 1);\n  const lengths = [2, 3, 3, 4, 5];\n  for (let i = 0; i < 5; i++) {\n    while (compGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, lengths[i], vertical) === false) {\n      x = Math.floor(Math.random() * 10) + 1;\n      y = Math.floor(Math.random() * 10) + 1;\n      coin = Math.floor(Math.random() * 2) + 1;\n      vertical = (coin === 1);\n    }\n  }\n  cboard.removeChild(cboard.firstChild);\n  cboard.append(compGB.getGrid());\n}\n\nfunction showModalOverlay() {\n  document.getElementById('modalOverlay').classList.add('active');\n}\n\nfunction hideModalOverlay() {\n  document.getElementById('modalOverlay').classList.remove('active');\n}\n\n// Objects for main loop\nconst playerGB = Gameboard();\nconst compGB = Gameboard();\nconst player = Player();\nconst compPlayer = ComputerPlayer();\n\n// Boards displayed\nconst pboard = document.querySelector('#pboard');\npboard.appendChild(playerGB.getGrid());\nconst cboard = document.querySelector('#cboard');\ncboard.appendChild(compGB.getGrid());\n\ninitializeCompGB(cboard, compGB);\nshowModalOverlay();\n\n// Logic for the popup form\nconst popup = document.querySelector('#popup');\nconst submit = document.querySelector('#formSubmit');\nconst error = document.querySelector('#error');\nconst popTitle = document.querySelector('.popTitle');\nlet lengths = [2, 3, 3, 4, 5];\nsubmit.addEventListener('click', (event) => {\n  const x = document.querySelector('.xCord').value;\n  const y = document.querySelector('.yCord').value;\n  const vertical = document.querySelector('input[type=\"checkbox\"]').checked;\n  const length = lengths[0];\n  if (playerGB.placeShip(parseInt(x) - 1, parseInt(y) - 1, length, vertical) === false) {\n    error.style.display = 'block';\n  }\n  else {\n    error.style.display = 'none';\n    pboard.removeChild(pboard.firstChild);\n    pboard.append(playerGB.getGrid());\n    lengths.shift();\n    popTitle.innerHTML = 'Ship of length ' + lengths[0];\n    document.querySelector('.xCord').value = '';\n    document.querySelector('.yCord').value = '';\n  }\n  if (lengths.length === 0) {\n    lengths = [2, 3, 3, 4, 5];\n    hideModalOverlay();\n    pboard.removeChild(pboard.firstChild);\n    pboard.append(playerGB.getGrid());\n    popup.style.display = 'none';\n    // Main game\n    // Define the event handler function\n    const clickHandler = function (event) {\n      const clickedTile = event.target;\n      if (clickedTile.classList.contains('tile')) {\n        const str1 = clickedTile.getAttribute('class');\n        if (!str1.includes('missed') && !str1.includes('hit')) {\n          const str2 = clickedTile.getAttribute('id');\n          const coordinates = str2.split(' ');\n          player.attack(compGB, parseInt(coordinates[0]), parseInt(coordinates[1]));\n          cboard.removeChild(cboard.firstChild);\n          cboard.append(compGB.getGrid());\n          compPlayer.attack(playerGB);\n          pboard.removeChild(pboard.firstChild);\n          pboard.append(playerGB.getGrid());\n          // Check for winner\n          const winPop = document.querySelector('.winPop');\n          const winner = document.querySelector('.winner');\n          if (compGB.allSunk() && playerGB.allSunk()) {\n            winPop.style.display = 'block';\n            winner.innerHTML = 'Tied game!';\n            showModalOverlay();\n          } else if (compGB.allSunk()) {\n            winPop.style.display = 'block';\n            winner.innerHTML = 'You win!';\n            showModalOverlay();\n          } else if (playerGB.allSunk()) {\n            winPop.style.display = 'block';\n            winner.innerHTML = 'You lose!';\n            showModalOverlay();\n          }\n          // Reset game\n          const again = document.querySelector('.again');\n          again.addEventListener('click', () => {\n            // Remove the event listener before resetting\n            cboard.removeEventListener('click', clickHandler);\n            playerGB.resetBoard();\n            compGB.resetBoard();\n            pboard.removeChild(pboard.firstChild);\n            cboard.removeChild(cboard.firstChild);\n            pboard.appendChild(playerGB.getGrid());\n            cboard.appendChild(compGB.getGrid());\n            initializeCompGB(cboard, compGB);\n            popup.style.display = 'block';\n            winPop.style.display = 'none';\n          });\n        }\n      }\n    };\n    cboard.addEventListener('click', clickHandler);\n  } \n});\n\nmodule.exports = {\n  Ship,\n  Gameboard,\n  Player,\n  ComputerPlayer,\n};\n\n\n//# sourceURL=webpack://webpack-demo/./src/index.js?");

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