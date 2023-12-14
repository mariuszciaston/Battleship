const shipFactory = (length) => {
	let hitCounter = 0;

	if (length >= 2 && length <= 5) {
		const shipLength = length;

		const hit = () => {
			hitCounter += 1;
		};

		const isSunk = () => {
			if (shipLength === hitCounter) {
				return true;
			}
			return false;
		};

		return { shipLength, hit, isSunk };
	}

	return 'Ship length out of range';
};

export default shipFactory;
