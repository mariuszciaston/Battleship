import { Gameboard, Player } from './types';

const playerFactory = (): Player => {
	const attack = (gameboard: Gameboard, col: string, row: string): string => {
		if (gameboard.getCell(col, row).status !== 'hit' && gameboard.getCell(col, row).status !== 'miss') {
			return gameboard.receiveAttack(col, row);
		}
		return 'already shot';
	};

	const randomAttack = (gameboard: Gameboard): { result: string; col: string; row: string } => {
		const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

		let randomCol;
		let randomRow;

		do {
			randomCol = cols[Math.floor(Math.random() * cols.length)];
			randomRow = Math.ceil(Math.random() * 10).toString();
		} while (gameboard.getCell(randomCol, randomRow).status === 'hit' || gameboard.getCell(randomCol, randomRow).status === 'miss');

		if (gameboard.getCell(randomCol, randomRow).status !== 'hit' && gameboard.getCell(randomCol, randomRow).status !== 'miss') {
			const result = gameboard.receiveAttack(randomCol, randomRow);
			return { result, col: randomCol, row: randomRow };
		}
		return { result: 'already shot', col: randomCol, row: randomRow };
	};

	return { attack, randomAttack };
};

export default playerFactory;
