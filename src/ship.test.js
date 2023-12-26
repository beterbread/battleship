const { Ship, Gameboard } = require('./index.js');

// Ship tests
describe('Ship', () => {
    test('Not sunk yet', () => {
        const ship = Ship(5);
        expect(ship.isSunk()).toBe(false);
    });

    test('Sunk', () => {
        const ship = Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});
