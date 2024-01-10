import { Gameboard, Player } from './types';

const playerFactory = (): Player => {
	const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	let prevHit: { col: string; row: string } | null = null;
	let lastHit: { col: string; row: string } | null = null;

	prevHit = { col: 'C', row: '5' };
	lastHit = { col: 'B', row: '5' };

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

			const cell = gameboard.getCell(randomCol, randomRow);
			if (cell.status === 'hit') {
				prevHit = lastHit;

				lastHit = {
					col: cell.col,
					row: cell.row,
				};
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

			const cell = gameboard.getCell(newCol, newRow);
			if (cell.status === 'hit') {
				prevHit = lastHit;

				lastHit = {
					col: cell.col,
					row: cell.row,
				};
			}

			console.log('prevHit', prevHit);
			console.log('lastHit', lastHit);
			console.log('range', range);
			console.log('---------------');
		} else {
			console.log('Nie ma dostępnych kierunków do ataku');
		}
	};

	let range = 1;
	let goRight = false;

	const finishingAttack = (gameboard: Gameboard, col: string, row: string) => {
		if (prevHit.row === lastHit.row) {
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

					const cell = gameboard.getCell(newCol, row);
					if (cell.status === 'hit') {
						prevHit = lastHit;

						lastHit = {
							col: cell.col,
							row: cell.row,
						};
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
					// finishingAttack(gameboard, col, row);
				}
				if (!gameboard.getCell(newCol, row)) {
					finishingAttack(gameboard, newCol, row);
					// range = 1;
					// goRight = false;
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

					const cell = gameboard.getCell(newCol, row);
					if (cell.status === 'hit') {
						prevHit = lastHit;

						lastHit = {
							col: cell.col,
							row: cell.row,
						};
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
					// finishingAttack(gameboard, col, row);
				}
				if (!gameboard.getCell(newCol, row)) {
					finishingAttack(gameboard, newCol, row);
					// range = 1;
					// goRight = true;
				}
			}
		} else {
			// vertical ship case
		}
	};

	return { attack, randomAttack, followupAttack, finishingAttack, prevHit, lastHit };
};

export default playerFactory;
