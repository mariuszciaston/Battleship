// No.	Class of ship	Size
// 1	Carrier			5
// 2	Battleship		4
// 3	Destroyer		3
// 4	Submarine		3
// 5	Patrol Boat		2

const shipFactory = (name) => {
	let hitCounter = 0;

	let size;

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
