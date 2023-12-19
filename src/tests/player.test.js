/* eslint-disable no-undef */

import shipFactory from '../modules/ship';
import { humanGameboard, computerGameboard } from '../modules/gameBoard';
import playerFactory from '../modules/player';

describe('playerFactory', () => {
	let humanPlayer;
	let computerPlayer;

	const ship = shipFactory('Submarine');

	beforeEach(() => {
		humanPlayer = playerFactory();
		computerPlayer = playerFactory();
	});

	test('humanPlayer attack', () => {
		expect(humanPlayer.attack('A', '1', computerGameboard)).toBe('miss');
		expect(humanPlayer.attack('A', '1', computerGameboard)).toBe('already shot');

		computerGameboard.placeShip(ship, 'A', '3', 'horizontal');
		expect(humanPlayer.attack('A', '3', computerGameboard)).toBe('hit');
		expect(humanPlayer.attack('A', '3', computerGameboard)).toBe('already shot');
	});

	test('computerPlayer randomAttack', () => {
		expect(computerPlayer.randomAttack(humanGameboard)).toBe('miss');
	});
});
