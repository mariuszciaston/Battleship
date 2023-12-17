/* eslint-disable no-undef */
import shipFactory from '../modules/ship';
import gameBoardFactory from '../modules/gameBoard';

describe('Ship placing', () => {
	const ship = shipFactory('Destroyer');

	it('should place ship at specific coordinates, horizontal', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '1', 'horizontal');

		expect(gameBoard.getCell('A', '1').status && gameBoard.getCell('B', '1').status && gameBoard.getCell('C', '1').status).toBe('taken');
	});

	it('should place ship at specific coordinates, vertical', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '1', 'vertical');

		expect(gameBoard.getCell('A', '1').status && gameBoard.getCell('A', '2').status && gameBoard.getCell('A', '3').status).toBe('taken');
	});

	it('should give error when placing ship outside board, horizontal', () => {
		const gameBoard = gameBoardFactory();

		expect(gameBoard.placeShip(ship, 'J', '5', 'horizontal')).toBe("Can't place ship out of board");
	});

	it('should give error when placing ship outside board, vertical', () => {
		const gameBoard = gameBoardFactory();

		expect(gameBoard.placeShip(ship, 'B', '10', 'vertical')).toBe("Can't place ship out of board");
	});

	it('should give error when another ship occupy space or cells are not empty', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '8', 'horizontal');

		expect(gameBoard.placeShip(ship, 'A', '8', 'horizontal')).toBe("Can't place ship, cells are not empty");
	});
});

describe('Receiving attack', () => {
	const ship = shipFactory('Destroyer');

	it('should receive attack on ships', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '1', 'horizontal');

		expect(gameBoard.receiveAttack('A', '1')).toBe('hit');
		expect(gameBoard.receiveAttack('B', '1')).toBe('hit');
		expect(gameBoard.receiveAttack('C', '1')).toBe('hit');
	});

	it('should result in miss when shot is missed', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '1', 'horizontal');

		expect(gameBoard.receiveAttack('D', '2')).toBe('miss');
		expect(gameBoard.receiveAttack('E', '3')).toBe('miss');
		expect(gameBoard.receiveAttack('F', '4')).toBe('miss');
	});
});
