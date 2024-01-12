import { Cell, Gameboard, Player } from './types';

const playerFactory = (): Player => {
	const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	let prevHit: { col: string; row: string } | null = null;
	let lastHit: { col: string; row: string } | null = null;

	const attack = (gameboard: Gameboard, col: string, row: string): string => {
		if (gameboard.getCell(col, row).status !== 'hit' && gameboard.getCell(col, row).status !== 'miss') {
			return gameboard.receiveAttack(col, row);
		}
		return 'already shot';
	};

	const randomAttack = (gameboard: Gameboard): { result: string; col: string; row: string } => {
		let randomCol;
		let randomRow;

		do {
			randomCol = cols[Math.floor(Math.random() * cols.length)];
			randomRow = Math.ceil(Math.random() * 10).toString();
		} while (gameboard.getCell(randomCol, randomRow).status === 'hit' || gameboard.getCell(randomCol, randomRow).status === 'miss');

		if (gameboard.getCell(randomCol, randomRow).status !== 'hit' && gameboard.getCell(randomCol, randomRow).status !== 'miss') {
			const result = gameboard.receiveAttack(randomCol, randomRow);

			if (gameboard.getCell(randomCol, randomRow).status === 'hit') {
				setPrevHit(lastHit);
				setLastHit({ col: randomCol, row: randomRow });

				console.log('---------------');
				console.log('randomAttack prevHit', prevHit);
				console.log('randomAttack lastHit', lastHit);
				console.log('randomAttack range', range);
			}

			return { result, col: randomCol, row: randomRow };
		}
		return { result: 'already shot', col: randomCol, row: randomRow };
	};

	const followupAttack = (gameboard: Gameboard, col: string, row: string) => {
		const directions = [
			{ col: 0, row: -1 },
			{ col: 0, row: 1 },
			{ col: -1, row: 0 },
			{ col: 1, row: 0 },
		];

		const validDirections = directions.filter((direction) => {
			const newCol = String.fromCharCode(col.charCodeAt(0) + direction.col);
			const newRow = (Number(row) + direction.row).toString();

			const cell = gameboard.getCell(newCol, newRow);
			if (cell && cell.status !== 'miss' && cell.status !== 'hit') {
				return true;
			}
			return false;
		});

		if (validDirections.length > 0) {
			const randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
			const newCol = String.fromCharCode(col.charCodeAt(0) + randomDirection.col);
			const newRow = (Number(row) + randomDirection.row).toString();

			gameboard.receiveAttack(newCol, newRow);
			range = 1;

			if (gameboard.getCell(newCol, newRow).status === 'hit') {
				setPrevHit(lastHit);
				setLastHit({ col: newCol, row: newRow });

				console.log('---------------');
				console.log('followupAttack prevHit', prevHit);
				console.log('followupAttack lastHit', lastHit);
				console.log('followupAttack range', range);
			}
		} else {
			console.log('Nie ma dostępnych kierunków do ataku');
		}
	};

	let range = 1;
	let goRight = true;
	let goDown = true;

	const finishingAttack = (gameboard: Gameboard, col: string, row: string, prevHit: Cell) => {
		console.log('start finishingAttack prevHit', prevHit);
		console.log('start finishingAttack lastHit', { col, row });

		if (prevHit.row === row) {
			// horizontal ship case

			if (goRight) {
				range = 1;
				console.log('goRight');
				let newCol = String.fromCharCode(col.charCodeAt(0) + range);

				while (gameboard.getCell(newCol, row) && gameboard.getCell(newCol, row).status === 'hit') {
					range += 1;
					newCol = String.fromCharCode(col.charCodeAt(0) + range);
				}

				if (gameboard.getCell(newCol, row) && gameboard.getCell(newCol, row).status !== 'hit' && gameboard.getCell(newCol, row).status !== 'miss') {
					gameboard.receiveAttack(newCol, row);

					if (gameboard.getCell(newCol, row).status === 'hit') {
						setPrevHit(lastHit);
						setLastHit({ col: newCol, row: row });
					}

					console.log('prevHit', prevHit);
					console.log('lastHit', lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(newCol, row) || gameboard.getCell(newCol, row).status === 'miss') {
					range = 1;
					goRight = false;
				}
				if (!gameboard.getCell(newCol, row)) {
					finishingAttack(gameboard, newCol, row, prevHit);
				}
			} else {
				range = 1;
				console.log('goLeft');
				let newCol = String.fromCharCode(col.charCodeAt(0) - range);

				while (gameboard.getCell(newCol, row) && gameboard.getCell(newCol, row).status === 'hit') {
					range += 1;
					newCol = String.fromCharCode(col.charCodeAt(0) - range);
				}

				if (gameboard.getCell(newCol, row) && gameboard.getCell(newCol, row).status !== 'hit' && gameboard.getCell(newCol, row).status !== 'miss') {
					gameboard.receiveAttack(newCol, row);

					if (gameboard.getCell(newCol, row).status === 'hit') {
						setPrevHit(lastHit);
						setLastHit({ col: newCol, row: row });
					}

					console.log('prevHit', prevHit);
					console.log('lastHit', lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(newCol, row) || gameboard.getCell(newCol, row).status === 'miss') {
					range = 1;
					goRight = true;
				}
				if (!gameboard.getCell(newCol, row)) {
					finishingAttack(gameboard, newCol, row, prevHit);
				}
			}
		} else if (prevHit.col === col) {
			// vertical ship case

			if (goDown) {
				range = 1;
				console.log('goDown');
				let newRow = String.fromCharCode(row.charCodeAt(0) + range);

				while (gameboard.getCell(col, newRow) && gameboard.getCell(col, newRow).status === 'hit') {
					range += 1;
					newRow = String.fromCharCode(row.charCodeAt(0) + range);
				}

				if (gameboard.getCell(col, newRow) && gameboard.getCell(col, newRow).status !== 'hit' && gameboard.getCell(col, newRow).status !== 'miss') {
					gameboard.receiveAttack(col, newRow);

					if (gameboard.getCell(col, newRow).status === 'hit') {
						setPrevHit(lastHit);
						setLastHit({ col: col, row: newRow });
					}

					console.log('prevHit', prevHit);
					console.log('lastHit', lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(col, newRow) || gameboard.getCell(col, newRow).status === 'miss') {
					range = 1;
					goDown = false;
				}
				if (!gameboard.getCell(col, newRow)) {
					finishingAttack(gameboard, col, newRow, prevHit);
				}
			} else {
				range = 1;
				console.log('goUp');
				let newRow = String.fromCharCode(row.charCodeAt(0) - range);

				while (gameboard.getCell(col, newRow) && gameboard.getCell(col, newRow).status === 'hit') {
					range += 1;
					newRow = String.fromCharCode(row.charCodeAt(0) - range);
				}

				if (gameboard.getCell(col, newRow) && gameboard.getCell(col, newRow).status !== 'hit' && gameboard.getCell(col, newRow).status !== 'miss') {
					gameboard.receiveAttack(col, newRow);

					if (gameboard.getCell(col, newRow).status === 'hit') {
						setPrevHit(lastHit);
						setLastHit({ col: col, row: newRow });
					}

					console.log('prevHit', prevHit);
					console.log('lastHit', lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(col, newRow) || gameboard.getCell(col, newRow).status === 'miss') {
					range = 1;
					goDown = true;
				}
				if (!gameboard.getCell(col, newRow)) {
					finishingAttack(gameboard, col, newRow, prevHit);
				}
			}
		}
	};

	const getPrevHit = () => {
		return prevHit;
	};

	const getLastHit = () => {
		return lastHit;
	};

	const setPrevHit = (newPrevHit: Cell) => {
		prevHit = newPrevHit;
	};

	const setLastHit = (newLastHit: Cell) => {
		lastHit = newLastHit;
	};

	return { attack, randomAttack, followupAttack, finishingAttack, prevHit, lastHit, getPrevHit, getLastHit, setPrevHit, setLastHit };
};

export default playerFactory;
