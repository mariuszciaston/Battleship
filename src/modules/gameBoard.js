const gameBoardFactory = () => {
	const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	const array = [];

	const generateArray = () => {
		for (let i = 0; i < 10; i += 1) {
			array[i] = [];

			for (let j = 0; j < 10; j += 1) {
				array[i][j] = { col: cols[j], row: rows[i], status: 'empty' };
			}
		}
	};

	const getCell = (col, row) => {
		const colIndex = cols.indexOf(col);
		const rowIndex = rows.indexOf(row);

		if (colIndex === -1 || rowIndex === -1) {
			return 'Out of board';
		}

		return array[rowIndex][colIndex];
	};

	const placeShip = (ship, col, row, orientation) => {
		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		for (let i = 0; i < ship.shipLength; i += 1) {
			const cell = getCell(isHorizontal ? cells[start + i] : col, isHorizontal ? row : cells[start + i]);

			if (start + i >= cells.length || cell.status !== 'empty') {
				return "Can't place ship";
			}

			cell.status = 'taken';
		}

		return 'Ship placed successfully';
	};

	generateArray();

	return { placeShip, getCell };
};

export default gameBoardFactory;
