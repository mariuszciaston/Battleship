import { Gameboard, Player } from './types';

import controller from './controller';

const playerFactory = (): Player => {
	const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
				controller.prevHit = controller.lastHit;

				controller.lastHit = {
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
				controller.prevHit = controller.lastHit;

				controller.lastHit = {
					col: cell.col,
					row: cell.row,
				};
			}

			console.log('prevHit', controller.prevHit);
			console.log('lastHit', controller.lastHit);
			console.log('range', range);
			console.log('---------------');
		} else {
			console.log('Nie ma dostępnych kierunków do ataku');
		}
	};

	let range = 1;
	let goRight = false;

	const finishingAttack = (gameboard: Gameboard, col: string, row: string) => {
		if (controller.prevHit.row === controller.lastHit.row) {
			// horizontal ship case

			if (goRight) {
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
						controller.prevHit = controller.lastHit;

						controller.lastHit = {
							col: cell.col,
							row: cell.row,
						};
					}

					console.log('prevHit', controller.prevHit);
					console.log('lastHit', controller.lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(newCol, row) || gameboard.getCell(newCol, row).status === 'miss') {
					range = 1;
					goRight = false;

					finishingAttack(gameboard, col, row);
				}
			} else {
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
						controller.prevHit = controller.lastHit;

						controller.lastHit = {
							col: cell.col,
							row: cell.row,
						};
					}

					console.log('prevHit', controller.prevHit);
					console.log('lastHit', controller.lastHit);
					console.log('range', range);
					console.log('---------------');

					range += 1;
				}

				if (!gameboard.getCell(newCol, row) || gameboard.getCell(newCol, row).status === 'miss') {
					range = 1;
					goRight = true;

					finishingAttack(gameboard, col, row);
				}
			}
		} else {
			// vertical ship case
		}
	};

	return { attack, randomAttack, followupAttack, finishingAttack };
};

export default playerFactory;
