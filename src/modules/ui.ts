import { Gameboard, Cell } from './types';

import start, { humanGameboard, computerGameboard } from './controller';

const ui = (() => {
	const wrapper = document.querySelector('#wrapper');
	const boards = document.createElement('div');
	boards.id = 'boards';
	wrapper.append(boards);

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
		boards.append(board);
	};

	const refreshBoard = (gameboard: Gameboard) => {
		const boardId = gameboard === humanGameboard ? 'firstBoard' : 'secondBoard';
		const board = document.querySelector(`#${boardId}`);
		board.innerHTML = '';
		renderCells(gameboard, board);
	};

	const getUserInput = (e: Event) => {
		console.log(e.target);
		if (!(e.target as Element).classList.contains('hit') && !(e.target as Element).classList.contains('miss')) {
			const col = (e.target as Element).getAttribute('data-col');
			const row = (e.target as Element).getAttribute('data-row');
			return { col, row };
		}
	};

	async function handleUserInput() {
		const cells = document.querySelectorAll('#secondBoard .cell');

		let userInput: Cell;
		do {
			userInput = await new Promise((resolve) => {
				cells.forEach((cell) => {
					if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
						cell.addEventListener(
							'click',
							(e) => {
								resolve(getUserInput(e));
							},
							{ once: true }
						);
					}
				});
			});
		} while (!userInput);

		const col = userInput.col.toString();
		const row = userInput.row.toString();
		return { col, row };
	}

	return { renderBoard, refreshBoard, handleUserInput };
})();

export default ui;
