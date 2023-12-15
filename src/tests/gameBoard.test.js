/* eslint-disable no-undef */

import gameBoardFactory from '../modules/gameBoard';

describe('gameBoardFactory', () => {
	const ship = { shipLength: 3 };

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

		expect(gameBoard.placeShip(ship, 'J', '5', 'horizontal')).toBe("Can't place ship outside board");
	});

	it('should give error when placing ship outside board, vertical', () => {
		const gameBoard = gameBoardFactory();

		expect(gameBoard.placeShip(ship, 'B', '10', 'vertical')).toBe("Can't place ship outside board");
	});

	it('should give error when another ship occupy space', () => {
		const gameBoard = gameBoardFactory();
		gameBoard.placeShip(ship, 'A', '8', 'horizontal');

		expect(gameBoard.placeShip(ship, 'A', '8', 'horizontal')).toBe("Can't place ship outside board");
	});
});
