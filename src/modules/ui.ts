import { Gameboard, Cell } from './types';

import { humanGameboard, computerGameboard, human } from './game';

const ui = () => {
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

	const getUserInput = () => {
		const secondBoard = document.querySelector('#secondBoard');

		secondBoard.addEventListener('click', (e) => {
			if (!(e.target as Element).classList.contains('hit') && !(e.target as Element).classList.contains('miss')) {
				const col = (e.target as Element).getAttribute('data-col');
				const row = (e.target as Element).getAttribute('data-row');

				human.attack(computerGameboard, col, row);
				refreshBoard(computerGameboard);
			}
		});
	};

	renderBoard(humanGameboard);
	renderBoard(computerGameboard);

	getUserInput();
};

export default ui;
