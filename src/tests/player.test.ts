import gameboardFactory from '../modules/gameboard';
import shipFactory from '../modules/ship';
import playerFactory from '../modules/player';

describe('playerFactory', () => {
	const ship = shipFactory('Submarine');

	const computerGameboard = gameboardFactory();
	const humanGameboard = gameboardFactory();

	const humanPlayer = playerFactory();
	const computerPlayer = playerFactory();

	test('humanPlayer attack and miss', () => {
		expect(humanPlayer.attack(computerGameboard, 'A', '1')).toBe('miss');
		expect(humanPlayer.attack(computerGameboard, 'A', '1')).toBe('already shot');
	});

	test('humanPlayer attack and hit', () => {
		computerGameboard.placeShip(ship, 'A', '3', 'horizontal');
		expect(humanPlayer.attack(computerGameboard, 'A', '3')).toBe('hit');
		expect(humanPlayer.attack(computerGameboard, 'A', '3')).toBe('already shot');
	});

	test('computerPlayer randomAttack on empty board', () => {
		expect(computerPlayer.randomAttack(humanGameboard)).toBe('miss');
	});
});
