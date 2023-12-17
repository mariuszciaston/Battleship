import shipFactory from './ship';

const gameBoardFactory = () => {
	const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	const array = [];

	const generateArray = () => {
		for (let i = 0; i < 10; i += 1) {
			array[i] = [];

			for (let j = 0; j < 10; j += 1) {
				array[i][j] = { col: cols[j], row: rows[i], status: 'empty', takenBy: 'none' };
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

	const setCell = (col, row, newStatus, newTakenBy) => {
		const colIndex = cols.indexOf(col);
		const rowIndex = rows.indexOf(row);

		if (colIndex === -1 || rowIndex === -1) {
			return 'Out of board';
		}

		array[rowIndex][colIndex].status = newStatus;

		if (newTakenBy) {
			array[rowIndex][colIndex].takenBy = newTakenBy;
		}

		return array[rowIndex][colIndex];
	};

	const placeShip = (ship, col, row, orientation) => {
		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		if (start < 0 || start + ship.size > cells.length) {
			return "Can't place ship out of board";
		}

		for (let i = 0; i < ship.size; i += 1) {
			const currentCol = isHorizontal ? cells[start + i] : col;
			const currentRow = isHorizontal ? row : cells[start + i];
			const cellStatus = getCell(currentCol, currentRow).status;

			if (cellStatus !== 'empty') {
				return "Can't place ship, cells are not empty";
			}

			setCell(currentCol, currentRow, 'taken', ship);
		}

		return 'Ship placed successfully';
	};

	const receiveAttack = (col, row) => {
		const cell = getCell(col, row);

		if (cell.status === 'taken') {
			cell.takenBy.hit();
			setCell(col, row, 'hit');
			return cell.status;
		}
		if (cell.status === 'empty') {
			setCell(col, row, 'miss');
			return cell.status;
		}
		return null;
	};

	generateArray();

	return { getCell, placeShip, receiveAttack };
};

export default gameBoardFactory;
