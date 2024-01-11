import gameboardFactory from '../modules/gameboard';
import shipFactory from '../modules/ship';
import playerFactory from '../modules/player';
import { Gameboard, Ship, Player } from '../modules/types';

describe('playerFactory', () => {
	let submarine: Ship;
	let carrier: Ship;

	let computerGameboard: Gameboard;
	let humanGameboard: Gameboard;

	let human: Player;
	let computer: Player;

	beforeEach(() => {
		submarine = shipFactory('Submarine');
		carrier = shipFactory('Carrier');

		computerGameboard = gameboardFactory();
		humanGameboard = gameboardFactory();

		human = playerFactory();
		computer = playerFactory();
	});

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

	test('computer finishingAttack from left to right', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'A', '1');
		computer.attack(humanGameboard, 'B', '1');

		computer.prevHit = { col: 'A', row: '1' };
		computer.lastHit = { col: 'B', row: '1' };

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('C', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('D', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('E', '1').status).toBe('hit');
	});

	test('computer finishingAttack from right to right', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'D', '1');
		computer.attack(humanGameboard, 'E', '1');

		computer.prevHit = { col: 'D', row: '1' };
		computer.lastHit = { col: 'E', row: '1' };

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('C', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to right 1', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'C', '1');
		computer.attack(humanGameboard, 'D', '1');

		computer.prevHit = { col: 'C', row: '1' };
		computer.lastHit = { col: 'D', row: '1' };

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to right 2', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'D', '1');
		computer.attack(humanGameboard, 'C', '1');

		computer.prevHit = { col: 'D', row: '1' };
		computer.lastHit = { col: 'C', row: '1' };

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.lastHit.col, computer.lastHit.row, computer.prevHit);

		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});
});
