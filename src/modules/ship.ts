import { Ship } from '../modules/types';

const shipFactory = (name: string): Ship => {
	let hitCounter = 0;
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

	const hit = () => {
		hitCounter += 1;
	};

	const isSunk = () => {
		if (hitCounter === size) {
			return true;
		}
		return false;
	};

	return { name, size, hit, isSunk };
};

export default shipFactory;
