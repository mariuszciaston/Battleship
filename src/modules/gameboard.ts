import { Gameboard, Cell, Ship } from './types';

const gameboardFactory = (): Gameboard => {
	const cols: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const rows: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	const array: Cell[][] = [];

	const generateArray = (): void => {
		for (let i = 0; i < 10; i += 1) {
			array[i] = [];

			for (let j = 0; j < 10; j += 1) {
				array[i][j] = { col: cols[j], row: rows[i], status: 'empty', takenBy: undefined };
			}
		}
	};

	const clearBoard = () => {
		for (let i = 0; i < 10; i += 1) {
			for (let j = 0; j < 10; j += 1) {
				array[i][j].status = 'empty';
				array[i][j].takenBy = undefined;
			}
		}
	};

	const getCell = (col: string, row: string): Cell => {
		const colIndex = cols.indexOf(col);
		const rowIndex = rows.indexOf(row);

		if (colIndex === -1 || rowIndex === -1) {
			return null;
		}

		return array[rowIndex][colIndex];
	};

	const setCell = (col: string, row: string, newStatus: string, newTakenBy?: Ship): Cell => {
		const colIndex = cols.indexOf(col);
		const rowIndex = rows.indexOf(row);

		if (colIndex === -1 || rowIndex === -1) {
			return null;
		}
		array[rowIndex][colIndex].status = newStatus;

		if (newTakenBy) {
			array[rowIndex][colIndex].takenBy = newTakenBy;
		}
		return array[rowIndex][colIndex];
	};

	const placeShip = (ship: Ship, col: string, row: string, orientation: string): boolean => {
		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		if (start < 0 || start + ship.size > cells.length) {
			return false;
		}

		for (let i = 0; i < ship.size; i += 1) {
			const currentCol = isHorizontal ? cells[start + i] : col;
			const currentRow = isHorizontal ? row : cells[start + i];

			if (getCell(currentCol, currentRow).status !== 'empty') {
				return false;
			}
			setCell(currentCol, currentRow, 'taken', ship);
		}
		return true;
	};

	const canBePlaced = (ship: Ship, col: string, row: string, orientation: string): boolean => {
		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		if (start < 0 || start + ship.size > cells.length) {
			return false;
		}

		for (let i = 0; i < ship.size; i += 1) {
			const currentCol = isHorizontal ? cells[start + i] : col;
			const currentRow = isHorizontal ? row : cells[start + i];

			if (getCell(currentCol, currentRow).status !== 'empty') {
				return false;
			}
			// setCell(currentCol, currentRow, 'taken', ship);
		}
		return true;
	};

	const receiveAttack = (col: string, row: string): string => {
		const cell = getCell(col, row);

		if (cell.status === 'taken') {
			cell.takenBy.hit();
			setCell(col, row, 'hit');
			return cell.status;
		}
		if (cell.status === 'empty' || cell.status === 'reserved') {
			setCell(col, row, 'miss');
			return cell.status;
		}
		return null;
	};

	const receiveAround = (col: string, row: string): string => {
		const cell = getCell(col, row);

		if (cell.status === 'empty') {
			setCell(col, row, 'reserved');
			return cell.status;
		}
		return null;
	};

	const reserveSpace = (gameboard: Gameboard, col: string, row: string) => {
		const cell = gameboard.getCell(col, row);
		if (cell && cell.takenBy) {
			const shipCells = gameboard.array.flat().filter((c) => c.takenBy && c.takenBy.name === cell.takenBy.name);

			shipCells.forEach((cell) => {
				const directions = [
					{ col: 0, row: -1 },
					{ col: 0, row: 1 },
					{ col: -1, row: 0 },
					{ col: 1, row: 0 },
					{ col: -1, row: -1 },
					{ col: -1, row: 1 },
					{ col: 1, row: -1 },
					{ col: 1, row: 1 },
				];

				directions.forEach((direction) => {
					const newCol = String.fromCharCode(cell.col.charCodeAt(0) + direction.col);
					const newRow = (Number(cell.row) + direction.row).toString();
					if (gameboard.getCell(newCol, newRow)) {
						gameboard.receiveAround(newCol, newRow);
					}
				});
			});
		}
	};

	const sinkShip = (gameboard: Gameboard, col: string, row: string) => {
		const cell = gameboard.getCell(col, row);
		if (cell && cell.takenBy && cell.takenBy.isSunk()) {
			const shipCells = gameboard.array.flat().filter((c) => c.takenBy && c.takenBy.name === cell.takenBy.name);

			shipCells.forEach((cell) => {
				const directions = [
					{ col: 0, row: -1 },
					{ col: 0, row: 1 },
					{ col: -1, row: 0 },
					{ col: 1, row: 0 },
					{ col: -1, row: -1 },
					{ col: -1, row: 1 },
					{ col: 1, row: -1 },
					{ col: 1, row: 1 },
				];

				directions.forEach((direction) => {
					const newCol = String.fromCharCode(cell.col.charCodeAt(0) + direction.col);
					const newRow = (Number(cell.row) + direction.row).toString();
					if (gameboard.getCell(newCol, newRow)) {
						gameboard.receiveAttack(newCol, newRow);
					}
				});
			});
		}
	};

	const hitButNotSunk = (gameboard: Gameboard): boolean => {
		const gameboardCells = gameboard.array.flat();

		return gameboardCells.some((cell) => {
			if (cell.status === 'hit' && cell.takenBy.isSunk() === false) {
				return true;
			}
			return false;
		});
	};

	const allSunk = (): boolean => {
		for (let i = 0; i < 10; i += 1) {
			for (let j = 0; j < 10; j += 1) {
				if (array[i][j].status === 'taken' && !array[i][j].takenBy.isSunk()) {
					return false;
				}
			}
		}
		return true;
	};

	generateArray();

	return { clearBoard, getCell, setCell, placeShip, receiveAttack, receiveAround, reserveSpace, hitButNotSunk, sinkShip, allSunk, array, canBePlaced };
};

export default gameboardFactory;
