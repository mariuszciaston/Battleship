/* eslint-disable no-undef */

import shipFactory from '../modules/ship';
import gameBoardFactory from '../modules/gameBoard';

describe('Ship placing', () => {
	let ship;
	let gameBoard;

	beforeEach(() => {
		ship = shipFactory('Destroyer');
		gameBoard = gameBoardFactory();
	});

	it('should place ship at specific coordinates, horizontal', () => {
		gameBoard.placeShip(ship, 'A', '1', 'horizontal');

		expect(gameBoard.getCell('A', '1').status && gameBoard.getCell('B', '1').status && gameBoard.getCell('C', '1').status).toBe('taken');
	});

	it('should place ship at specific coordinates, vertical', () => {
		gameBoard.placeShip(ship, 'A', '1', 'vertical');

		expect(gameBoard.getCell('A', '1').status && gameBoard.getCell('A', '2').status && gameBoard.getCell('A', '3').status).toBe('taken');
	});

	it('should give error when placing ship outside board, horizontal', () => {
		expect(gameBoard.placeShip(ship, 'J', '5', 'horizontal')).toBe("Can't place ship out of board");
	});

	it('should give error when placing ship outside board, vertical', () => {
		expect(gameBoard.placeShip(ship, 'B', '10', 'vertical')).toBe("Can't place ship out of board");
	});

	it('should give error when another ship occupy space or cells are not empty', () => {
		gameBoard.placeShip(ship, 'A', '8', 'horizontal');

		expect(gameBoard.placeShip(ship, 'A', '8', 'horizontal')).toBe("Can't place ship, cells are not empty");
	});
});

describe('Receiving attack', () => {
	let ship;
	let gameBoard;

	beforeEach(() => {
		ship = shipFactory('Destroyer');
		gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '1', 'horizontal');
	});

	it('should receive attack on ships', () => {
		expect(gameBoard.receiveAttack('A', '1')).toBe('hit');
		expect(gameBoard.receiveAttack('B', '1')).toBe('hit');
		expect(gameBoard.receiveAttack('C', '1')).toBe('hit');
	});

	it('should result in miss when shot is missed', () => {
		expect(gameBoard.receiveAttack('D', '2')).toBe('miss');
		expect(gameBoard.receiveAttack('E', '3')).toBe('miss');
		expect(gameBoard.receiveAttack('F', '4')).toBe('miss');
	});
});

describe('Sunk state', () => {
	const carrier = shipFactory('Carrier');
	const battleship = shipFactory('Battleship');
	const destroyer = shipFactory('Destroyer');
	const submarine = shipFactory('Submarine');
	const patrolBoat = shipFactory('Patrol Boat');

	const gameBoard = gameBoardFactory();
	gameBoard.placeShip(carrier, 'A', '1', 'horizontal');
	gameBoard.placeShip(battleship, 'A', '2', 'horizontal');
	gameBoard.placeShip(destroyer, 'A', '3', 'horizontal');
	gameBoard.placeShip(submarine, 'A', '4', 'horizontal');
	gameBoard.placeShip(patrolBoat, 'A', '5', 'horizontal');

	it('should return true when all ships are sunk', () => {
		gameBoard.receiveAttack('A', '1');
		gameBoard.receiveAttack('B', '1');
		gameBoard.receiveAttack('C', '1');
		gameBoard.receiveAttack('D', '1');
		gameBoard.receiveAttack('E', '1');

		gameBoard.receiveAttack('A', '2');
		gameBoard.receiveAttack('B', '2');
		gameBoard.receiveAttack('C', '2');
		gameBoard.receiveAttack('D', '2');

		gameBoard.receiveAttack('A', '3');
		gameBoard.receiveAttack('B', '3');
		gameBoard.receiveAttack('C', '3');

		gameBoard.receiveAttack('A', '4');
		gameBoard.receiveAttack('B', '4');
		gameBoard.receiveAttack('C', '4');

		expect(gameBoard.getCell('A', '1').takenBy.isSunk()).toBe(true);
		expect(gameBoard.getCell('A', '2').takenBy.isSunk()).toBe(true);
		expect(gameBoard.getCell('A', '3').takenBy.isSunk()).toBe(true);
		expect(gameBoard.getCell('A', '4').takenBy.isSunk()).toBe(true);
		expect(gameBoard.getCell('A', '5').takenBy.isSunk()).toBe(false);

		gameBoard.receiveAttack('A', '5');
		gameBoard.receiveAttack('B', '5');

		expect(gameBoard.getCell('A', '5').takenBy.isSunk()).toBe(true);
	});
});
