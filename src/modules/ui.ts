import { Gameboard, Cell } from './types';

import { humanGameboard, computerGameboard } from './game';

const ui = (() => {
	const wrapper = document.createElement('div');
	wrapper.id = 'wrapper';
	document.body.append(wrapper);

	const createCell = (col: Cell) => {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		cell.classList.add(col.status);
		cell.setAttribute('data-col', col.col);
		cell.setAttribute('data-row', col.row);
		return cell;
	};

	const renderCells = (gameboard: Gameboard, board: Element) => {
		gameboard.array.forEach((row) => {
			row.forEach((col) => {
				const cell = createCell(col);
				board.append(cell);
			});
		});
	};

	const renderBoard = (gameboard: Gameboard) => {
		const board = document.createElement('div');
		board.classList.add('board');

		if (gameboard === humanGameboard) {
			board.id = 'firstBoard';
		} else if (gameboard === computerGameboard) {
			board.id = 'secondBoard';
		}

		renderCells(gameboard, board);
		wrapper.append(board);
	};

	const refreshBoard = (gameboard: Gameboard) => {
		const boardId = gameboard === humanGameboard ? 'firstBoard' : 'secondBoard';
		const board = document.querySelector(`#${boardId}`);
		board.innerHTML = '';
		renderCells(gameboard, board);
	};

	const getUserInput = (e: Event) => {
		if (!(e.target as Element).classList.contains('hit') && !(e.target as Element).classList.contains('miss')) {
			const col = (e.target as Element).getAttribute('data-col');
			const row = (e.target as Element).getAttribute('data-row');
			return { col, row };
		}
	};

	async function handleUserInput() {
		const secondBoard = document.querySelector('#secondBoard');

		let userInput: Cell;
		do {
			userInput = await new Promise((resolve) => {
				secondBoard.addEventListener(
					'click',
					(e) => {
						resolve(getUserInput(e));
					},
					{ once: true }
				);
			});
		} while (!userInput);

		const col = userInput.col.toString();
		const row = userInput.row.toString();
		return { col, row };
	}

	return { renderBoard, refreshBoard, handleUserInput };
})();

export default ui;
