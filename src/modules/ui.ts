import { Gameboard, Cell } from './types';

import controller from './controller';

const ui = (() => {
	const wrapper = document.querySelector('#wrapper');
	const boards = document.createElement('div');
	boards.id = 'boards';
	wrapper.prepend(boards);

	const pVcBtn = document.querySelector('#playerVsComputer') as Element;
	const cVcBtn = document.querySelector('#computerVsComputer') as Element;
	const newGameBtn = document.querySelector('#newGame') as HTMLButtonElement;

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

		if (gameboard === controller.humanGameboard) {
			board.id = 'firstBoard';
		} else if (gameboard === controller.computerGameboard) {
			board.id = 'secondBoard';
		}

		renderCells(gameboard, board);
		boards.append(board);
	};

	const refreshBoard = (gameboard: Gameboard) => {
		const boardId = gameboard === controller.humanGameboard ? 'firstBoard' : 'secondBoard';
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

	const handleUserInput = async () => {
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
	};

	const handleNewGame = async () => {
		newGameBtn.disabled = true;
		newGameBtn.textContent = 'Restarting';

		await controller.newGame();

		newGameBtn.textContent = 'New Game';
		newGameBtn.disabled = false;
	};

	const handleGameMode = (selectedElement: Element, deselectedElement: Element) => {
		deselectedElement.classList.remove('selected');

		if (!selectedElement.classList.contains('selected')) {
			selectedElement.classList.add('selected');
			controller.restart();
		}
	};

	pVcBtn.addEventListener('click', () => handleGameMode(pVcBtn, cVcBtn));
	cVcBtn.addEventListener('click', () => handleGameMode(cVcBtn, pVcBtn));
	newGameBtn.addEventListener('click', handleNewGame);

	return { renderBoard, refreshBoard, handleUserInput, pVcBtn, cVcBtn };
})();

export default ui;
