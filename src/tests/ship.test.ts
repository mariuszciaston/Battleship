import shipFactory from '../modules/ship';

describe('shipFactory', () => {
	it('should set correct ship size', () => {
		expect(shipFactory('Carrier').size).toEqual(5);
		expect(shipFactory('Battleship').size).toEqual(4);
		expect(shipFactory('Destroyer').size).toEqual(3);
		expect(shipFactory('Submarine').size).toEqual(3);
		expect(shipFactory('Patrol Boat').size).toEqual(2);
	});

	it('should return false when hit count is less than ship size', () => {
		const ship = shipFactory('Battleship');
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(false);
	});

	it('should return true when hit count equals ship size', () => {
		const ship = shipFactory('Battleship');
		ship.hit();
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(true);
	});
});
