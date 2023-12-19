/* eslint-disable no-undef */

import shipFactory from '../modules/ship';
import gameboardFactory from '../modules/gameboard';

describe('Ship placing', () => {
	let ship;
	let gameboard;

	beforeEach(() => {
		ship = shipFactory('Destroyer');
		gameboard = gameboardFactory();
	});

	it('should place ship at specific coordinates, horizontal', () => {
		gameboard.placeShip(ship, 'A', '1', 'horizontal');

		expect(gameboard.getCell('A', '1').status && gameboard.getCell('B', '1').status && gameboard.getCell('C', '1').status).toBe('taken');
	});

	it('should place ship at specific coordinates, vertical', () => {
		gameboard.placeShip(ship, 'A', '1', 'vertical');

		expect(gameboard.getCell('A', '1').status && gameboard.getCell('A', '2').status && gameboard.getCell('A', '3').status).toBe('taken');
	});

	it('should give error when placing ship outside board, horizontal', () => {
		expect(gameboard.placeShip(ship, 'J', '5', 'horizontal')).toBe("Can't place ship out of board");
	});

	it('should give error when placing ship outside board, vertical', () => {
		expect(gameboard.placeShip(ship, 'B', '10', 'vertical')).toBe("Can't place ship out of board");
	});

	it('should give error when another ship occupy space or cells are not empty', () => {
		gameboard.placeShip(ship, 'A', '8', 'horizontal');

		expect(gameboard.placeShip(ship, 'A', '8', 'horizontal')).toBe("Can't place ship, cells are not empty");
	});
});

describe('Receiving attack', () => {
	let ship;
	let gameboard;

	beforeEach(() => {
		ship = shipFactory('Destroyer');
		gameboard = gameboardFactory();
		gameboard.placeShip(ship, 'A', '1', 'horizontal');
	});

	it('should receive attack on ships', () => {
		expect(gameboard.receiveAttack('A', '1')).toBe('hit');
		expect(gameboard.receiveAttack('B', '1')).toBe('hit');
		expect(gameboard.receiveAttack('C', '1')).toBe('hit');
	});

	it('should result in miss when shot is missed', () => {
		expect(gameboard.receiveAttack('D', '2')).toBe('miss');
		expect(gameboard.receiveAttack('E', '3')).toBe('miss');
		expect(gameboard.receiveAttack('F', '4')).toBe('miss');
	});
});

describe('Sunk state', () => {
	const carrier = shipFactory('Carrier');
	const battleship = shipFactory('Battleship');
	const destroyer = shipFactory('Destroyer');
	const submarine = shipFactory('Submarine');
	const patrolBoat = shipFactory('Patrol Boat');
	const gameboard = gameboardFactory();

	gameboard.placeShip(carrier, 'A', '1', 'horizontal');
	gameboard.placeShip(battleship, 'A', '2', 'horizontal');
	gameboard.placeShip(destroyer, 'A', '3', 'horizontal');
	gameboard.placeShip(submarine, 'A', '4', 'horizontal');
	gameboard.placeShip(patrolBoat, 'A', '5', 'horizontal');

	it('should return true when all ships are sunk', () => {
		gameboard.receiveAttack('A', '1');
		gameboard.receiveAttack('B', '1');
		gameboard.receiveAttack('C', '1');
		gameboard.receiveAttack('D', '1');
		gameboard.receiveAttack('E', '1');

		gameboard.receiveAttack('A', '2');
		gameboard.receiveAttack('B', '2');
		gameboard.receiveAttack('C', '2');
		gameboard.receiveAttack('D', '2');

		gameboard.receiveAttack('A', '3');
		gameboard.receiveAttack('B', '3');
		gameboard.receiveAttack('C', '3');

		gameboard.receiveAttack('A', '4');
		gameboard.receiveAttack('B', '4');
		gameboard.receiveAttack('C', '4');

		expect(gameboard.getCell('A', '1').takenBy.isSunk()).toBe(true);
		expect(gameboard.getCell('A', '2').takenBy.isSunk()).toBe(true);
		expect(gameboard.getCell('A', '3').takenBy.isSunk()).toBe(true);
		expect(gameboard.getCell('A', '4').takenBy.isSunk()).toBe(true);
		expect(gameboard.getCell('A', '5').takenBy.isSunk()).toBe(false);

		gameboard.receiveAttack('A', '5');
		gameboard.receiveAttack('B', '5');

		expect(gameboard.getCell('A', '5').takenBy.isSunk()).toBe(true);
	});
});
