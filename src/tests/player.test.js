/* eslint-disable no-undef */

import shipFactory from '../modules/ship';
import gameboardFactory from '../modules/gameboard';
import playerFactory from '../modules/player';

describe('playerFactory', () => {
	const ship = shipFactory('Submarine');

	const computerGameboard = gameboardFactory();
	const humanGameboard = gameboardFactory();

	const humanPlayer = playerFactory();
	const computerPlayer = playerFactory();

	test('humanPlayer attack and miss', () => {
		expect(humanPlayer.attack('A', '1', computerGameboard)).toBe('miss');
		expect(humanPlayer.attack('A', '1', computerGameboard)).toBe('already shot');
	});

	test('humanPlayer attack and hit', () => {
		computerGameboard.placeShip(ship, 'A', '3', 'horizontal');
		expect(humanPlayer.attack('A', '3', computerGameboard)).toBe('hit');
		expect(humanPlayer.attack('A', '3', computerGameboard)).toBe('already shot');
	});

	test('computerPlayer randomAttack on empty board', () => {
		expect(computerPlayer.randomAttack(humanGameboard)).toBe('miss');
	});
});
