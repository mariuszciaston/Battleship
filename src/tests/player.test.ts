import gameboardFactory from '../modules/gameboard';
import shipFactory from '../modules/ship';
import playerFactory from '../modules/player';

describe('playerFactory', () => {
	const ship = shipFactory('Submarine');

	const computerGameboard = gameboardFactory();
	const humanGameboard = gameboardFactory();

	const human = playerFactory();
	const computer = playerFactory();

	test('human attack and miss', () => {
		expect(human.attack(computerGameboard, 'A', '1')).toBe('miss');
		expect(human.attack(computerGameboard, 'A', '1')).toBe('already shot');
	});

	test('human attack and hit', () => {
		computerGameboard.placeShip(ship, 'A', '3', 'horizontal');
		expect(human.attack(computerGameboard, 'A', '3')).toBe('hit');
		expect(human.attack(computerGameboard, 'A', '3')).toBe('already shot');
	});

	test('computer randomAttack on empty board', () => {
		expect(computer.randomAttack(humanGameboard)).toBe('miss');
	});
});
