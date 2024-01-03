import { Ship } from '../modules/types';

const shipFactory = (name: string): Ship => {
	let size: number;

	if (name === 'Carrier') {
		size = 5;
	}

	if (name === 'Battleship') {
		size = 4;
	}

	if (name === 'Destroyer') {
		size = 3;
	}

	if (name === 'Submarine') {
		size = 3;
	}

	if (name === 'Patrol Boat') {
		size = 2;
	}

	return {
		name,
		size,
		hitCount: 0,
		isVertical: false,
		rotate() {
			this.isVertical = !this.isVertical;
		},
		hit() {
			this.hitCount += 1;
		},
		isSunk() {
			return this.hitCount === size;
		},
	};
};

export default shipFactory;
