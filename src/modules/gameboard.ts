import { Gameboard, Cell, Ship } from './types';

const gameboardFactory = () => {
	const cols: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const rows: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	const array: Cell[][] = [];
	const shipsPlaced: Cell[] = [];

	const generateArray = ((): void => {
		for (let i = 0; i < 10; i += 1) {
			array[i] = [];

			for (let j = 0; j < 10; j += 1) {
				array[i][j] = { col: cols[j], row: rows[i], status: 'empty', takenBy: null };
			}
		}
	})();

	const clearBoard = () => {
		for (let i = 0; i < 10; i += 1) {
			for (let j = 0; j < 10; j += 1) {
				array[i][j].status = 'empty';
				array[i][j].takenBy = undefined;
			}
		}
		shipsPlaced.length = 0;
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

	const removeShip = (ship: Ship, gameboard: Gameboard) => {
		const gameboardCells: Cell[] = gameboard.array.flat();

		gameboardCells.forEach((cell) => {
			if (cell.status === 'taken' && cell.takenBy.name === ship.name) {
				cell.status = 'empty';
				cell.takenBy = null;
			}

			shipsPlaced.forEach((ship) => {
				if (ship.takenBy === null) {
					shipsPlaced.splice(shipsPlaced.indexOf(ship), 1);
				}
			});

			let boardId;
			if (gameboard === humanGameboard) {
				boardId = 'firstBoard';
			} else if (gameboard === computerGameboard) {
				boardId = 'secondBoard';
			}

			const cells = document.querySelectorAll(`#${boardId} .cell`);

			cells.forEach((cell) => {
				if (cell.classList.contains('taken') && cell.getAttribute('data-shipName') === ship.name.toLowerCase()) {
					cell.classList.remove('taken');
					cell.classList.add('empty');
					cell.removeAttribute('data-shipName');
				}
			});
		});
	};

	const placeShip = (ship: Ship, col: string, row: string, orientation: string): boolean => {
		if (orientation === 'horizontal') {
			ship.isVertical = false;
		} else {
			ship.isVertical = true;
		}

		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		let shipCells = [];

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

			shipCells.push(getCell(currentCol, currentRow));
		}

		shipsPlaced.push(shipCells[0]);

		return true;
	};

	const canBePlaced = (size: number, col: string, row: string, orientation: string): boolean => {
		const isHorizontal = orientation === 'horizontal';
		const cells = isHorizontal ? cols : rows;
		const start = cells.indexOf(isHorizontal ? col : row);

		if (start < 0 || start + size > cells.length) {
			return false;
		}

		const areEmpty = [];

		for (let i = 0; i < size; i += 1) {
			const currentCol = isHorizontal ? cells[start + i] : col;
			const currentRow = isHorizontal ? row : cells[start + i];

			areEmpty.push(getCell(currentCol, currentRow).status === 'empty');
		}

		return areEmpty.every((item) => item === true);
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

	const removeReservedSpace = (gameboard: Gameboard) => {
		const gameboardCells = gameboard.array.flat();

		gameboardCells.forEach((cell) => {
			if (cell.status === 'reserved') {
				setCell(cell.col, cell.row, 'empty');
			}
		});
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

	const allSunk = (gameboard: Gameboard): boolean => {
		const gameboardCells = gameboard.array.flat();

		let takenByCells = gameboardCells.filter((cell) => cell.takenBy);
		if (takenByCells.length > 0 && takenByCells.every((cell) => cell.takenBy.isSunk())) {
			return true;
		} else {
			return false;
		}
	};

	return {
		clearBoard,
		getCell,
		setCell,
		removeShip,
		placeShip,
		receiveAttack,
		receiveAround,
		reserveSpace,
		hitButNotSunk,
		sinkShip,
		allSunk,
		array,
		canBePlaced,
		shipsPlaced,
		removeReservedSpace,
	};
};

const humanGameboard = gameboardFactory();
const computerGameboard = gameboardFactory();

export { gameboardFactory, humanGameboard, computerGameboard };
