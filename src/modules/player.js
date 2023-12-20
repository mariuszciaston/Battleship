const playerFactory = () => {
	const attack = (col, row, gameboard) => {
		if (gameboard.getCell(col, row).status !== 'hit' && gameboard.getCell(col, row).status !== 'miss') {
			return gameboard.receiveAttack(col, row);
		}
		return 'already shot';
	};

	const randomAttack = (gameboard) => {
		const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

		let randomCol;
		let randomRow;

		do {
			randomCol = cols[Math.floor(Math.random() * cols.length)];
			randomRow = Math.ceil(Math.random() * 10).toString();
		} while (gameboard.getCell(randomCol, randomRow).status === 'hit' || gameboard.getCell(randomCol, randomRow).status === 'miss');

		if (gameboard.getCell(randomCol, randomRow).status !== 'hit' && gameboard.getCell(randomCol, randomRow).status !== 'miss') {
			return gameboard.receiveAttack(randomCol, randomRow);
		}
		return 'already shot';
	};

	return { attack, randomAttack };
};

export default playerFactory;
