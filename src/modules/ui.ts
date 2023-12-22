import { Gameboard } from './types';

import { humanGameboard, computerGameboard } from './game';

const ui = () => {
	const wrapper = document.createElement('div');
	wrapper.id = 'wrapper';
	document.body.append(wrapper);

	const renderBoard = (gameboard: Gameboard) => {
		const board = document.createElement('div');
		board.classList.add('board');

		if (gameboard === humanGameboard) {
			board.id = 'firstBoard';
		}

		if (gameboard === computerGameboard) {
			board.id = 'secondBoard';
		}

		gameboard.array.forEach((row) => {
			row.forEach((col) => {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.classList.add(col.status);
				cell.setAttribute('data-col', col.col);
				cell.setAttribute('data-row', col.row);
				board.append(cell);
			});
		});
		wrapper.append(board);
	};

	const firstBoard = renderBoard(humanGameboard);
	const secondBoard = renderBoard(computerGameboard);
};

export default ui;
