import gameboardFactory from '../modules/gameboard';
import shipFactory from '../modules/ship';
import playerFactory from '../modules/player';
import { Gameboard, Ship, Player } from '../modules/types';

describe('playerFactory', () => {
	let carrier: Ship;

	let computerGameboard: Gameboard;
	let humanGameboard: Gameboard;

	let human: Player;
	let computer: Player;

	beforeEach(() => {
		carrier = shipFactory('Carrier');

		computerGameboard = gameboardFactory();
		humanGameboard = gameboardFactory();

		human = playerFactory();
		computer = playerFactory();

		humanGameboard.generateArray();
		computerGameboard.generateArray();
	});

	test('human attack and miss', () => {
		expect(human.attack(computerGameboard, 'A', '1')).toBe('miss');
		expect(human.attack(computerGameboard, 'A', '1')).toBe('already shot');
	});

	test('human attack and hit', () => {
		computerGameboard.placeShip(carrier, 'A', '3', 'horizontal');

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

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('C', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('D', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('E', '1').status).toBe('hit');
	});

	test('computer finishingAttack from right to right', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'D', '1');
		computer.attack(humanGameboard, 'E', '1');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('C', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to right 1', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'C', '1');
		computer.attack(humanGameboard, 'D', '1');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to right 2', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'D', '1');
		computer.attack(humanGameboard, 'C', '1');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('B', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from up to down', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'vertical');

		computer.attack(humanGameboard, 'A', '1');
		computer.attack(humanGameboard, 'A', '2');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '3').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '4').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '5').status).toBe('hit');
	});

	test('computer finishingAttack from down to down', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'vertical');

		computer.attack(humanGameboard, 'A', '4');
		computer.attack(humanGameboard, 'A', '5');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '6').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '3').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '2').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to down 1', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'vertical');

		computer.attack(humanGameboard, 'A', '3');
		computer.attack(humanGameboard, 'A', '4');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '5').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '6').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '2').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from middle to down 2', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'vertical');

		computer.attack(humanGameboard, 'A', '4');
		computer.attack(humanGameboard, 'A', '3');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '5').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '6').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '2').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from left to right (miss on the right edge)', () => {
		humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');

		computer.attack(humanGameboard, 'F', '1');
		expect(humanGameboard.getCell('F', '1').status).toBe('miss');

		computer.attack(humanGameboard, 'B', '1');
		computer.attack(humanGameboard, 'C', '1');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('D', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('A', '1').status).toBe('hit');
	});

	test('computer finishingAttack from left to right (miss on the left edge)', () => {
		humanGameboard.placeShip(carrier, 'B', '1', 'horizontal');

		computer.attack(humanGameboard, 'A', '1');
		expect(humanGameboard.getCell('A', '1').status).toBe('miss');

		computer.attack(humanGameboard, 'C', '1');
		computer.attack(humanGameboard, 'D', '1');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('E', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('F', '1').status).toBe('hit');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('G', '1').status).toBe('miss');

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		expect(humanGameboard.getCell('B', '1').status).toBe('hit');
	});

	test.each(Array(100).fill(null))("Attack progress (horizontal), all cells except those taken by ship are a 'miss'", () => {
		humanGameboard.placeShip(carrier, 'B', '2', 'horizontal');

		humanGameboard.array.forEach((row) => {
			row.forEach((cell) => {
				if (cell.status === 'empty') {
					computer.attack(humanGameboard, cell.col, cell.row);
				}
			});
		});

		let { col, row } = computer.randomAttack(humanGameboard);
		computer.followupAttack(humanGameboard, col, row);

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());

		expect(humanGameboard.getCell('B', '2').takenBy.isSunk()).toBe(true);
	});

	test.each(Array(100).fill(null))("Attack progress (vertical), all cells except those taken by ship are a 'miss'", () => {
		humanGameboard.placeShip(carrier, 'I', '2', 'vertical');

		humanGameboard.array.forEach((row) => {
			row.forEach((cell) => {
				if (cell.status === 'empty') {
					computer.attack(humanGameboard, cell.col, cell.row);
				}
			});
		});

		let { col, row } = computer.randomAttack(humanGameboard);
		computer.followupAttack(humanGameboard, col, row);

		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());
		computer.finishingAttack(humanGameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());

		expect(humanGameboard.getCell('I', '2').takenBy.isSunk()).toBe(true);
	});
});
