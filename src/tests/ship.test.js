/* eslint-disable no-undef */

import shipFactory from '../modules/ship';

describe('shipFactory', () => {
	it('should set correct ship length', () => {
		expect(shipFactory(4).shipLength).toEqual(4);
	});

	it("should return 'Ship length out of range' when length is smaller than 2 or bigger than 5", () => {
		expect(shipFactory(1)).toBe('Ship length out of range');
		expect(shipFactory(6)).toBe('Ship length out of range');
	});

	it('should return false when hit count is less than ship length', () => {
		const ship = shipFactory(4);
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(false);
	});

	it('should return true when hit count equals ship length', () => {
		const ship = shipFactory(4);
		ship.hit();
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toBe(true);
	});
});
