import gameboardFactory from '../modules/gameboard';
import shipFactory from '../modules/ship';
import playerFactory from '../modules/player';

describe('playerFactory', () => {
	const submarine = shipFactory('Submarine');
	const carrier = shipFactory('Carrier');

	const computerGameboard = gameboardFactory();
	const humanGameboard = gameboardFactory();

	const human = playerFactory();
	const computer = playerFactory();

	test('human attack and miss', () => {
		expect(human.attack(computerGameboard, 'A', '1')).toBe('miss');
		expect(human.attack(computerGameboard, 'A', '1')).toBe('already shot');
	});

	test('human attack and hit', () => {
		computerGameboard.placeShip(submarine, 'A', '3', 'horizontal');
		expect(human.attack(computerGameboard, 'A', '3')).toBe('hit');
		expect(human.attack(computerGameboard, 'A', '3')).toBe('already shot');
	});

	test('computer randomAttack on empty board', () => {
		expect(computer.randomAttack(humanGameboard).result).toBe('miss');
	});

	test('computer followupAttack', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');
		computer.attack(humanGameboard, 'A', '1');
		computer.followupAttack(humanGameboard, 'A', '1');

		if (humanGameboard.getCell('A', '2').status === 'miss') {
			computer.followupAttack(humanGameboard, 'A', '1');

			expect(humanGameboard.getCell('B', '1').status).toBe('hit');
		} else {
			expect(humanGameboard.getCell('B', '1').status).toBe('hit');
		}
	});
});
