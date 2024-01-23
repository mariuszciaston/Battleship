import { Gameboard, Cell } from './types';

import controller from './controller';

const ui = (() => {
	const wrapper = document.querySelector('#wrapper');
	const boards = document.createElement('div');
	boards.id = 'boards';
	wrapper.prepend(boards);

	const pVcBtn = document.querySelector('#playerVsComputer') as HTMLButtonElement;
	const newGameBtn = document.querySelector('#newGame') as HTMLButtonElement;
	const cVcBtn = document.querySelector('#computerVsComputer') as HTMLButtonElement;

	const rotateBtn = document.querySelector('#rotateShip') as HTMLButtonElement;
	const startBtn = document.querySelector('#start') as HTMLButtonElement;
	const randomBtn = document.querySelector('#randomPlacement') as HTMLButtonElement;

	const allBtns = [pVcBtn, newGameBtn, cVcBtn, rotateBtn, startBtn, randomBtn];

	// let firstBoardElement;
	// let tempBoardElement;

	const createCell = (cell: Cell) => {
		const element = document.createElement('div');
		element.classList.add('cell');
		element.classList.add(cell.status);
		element.setAttribute('data-col', cell.col);
		element.setAttribute('data-row', cell.row);

		if (cell.takenBy) {
			element.setAttribute('data-shipName', cell.takenBy.name.toLowerCase());
		}

		return element;
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
			// firstBoardElement = document.querySelector('#firstBoard');
		} else if (gameboard === controller.computerGameboard) {
			board.id = 'secondBoard';
		} else if (gameboard === controller.tempBoard) {
			board.id = 'tempBoard';
			// tempBoardElement = document.querySelector('#firstBoard');
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

	const handlePvC = async () => {
		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));
		pVcBtn.textContent = 'Starting...';

		await new Promise((resolve) => setTimeout(resolve, 1000));

		pVcBtn.textContent = 'Player vs Computer';
		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);
	};

	const handleNewGame = async () => {
		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));
		newGameBtn.textContent = 'Restarting...';

		await controller.newGame();

		newGameBtn.textContent = 'New Game';
		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);
	};

	const handleCvC = async () => {
		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));
		cVcBtn.textContent = 'Starting...';

		await new Promise((resolve) => setTimeout(resolve, 1000));

		cVcBtn.textContent = 'Computer vs Computer';
		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);
	};

	const handleGameMode = async (selectedElement: HTMLButtonElement, deselectedElement: HTMLButtonElement) => {
		deselectedElement.classList.remove('selected');

		if (!selectedElement.classList.contains('selected')) {
			selectedElement.classList.add('selected');

			if (selectedElement === pVcBtn) {
				handlePvC();
			}

			if (selectedElement === cVcBtn) {
				handleCvC();
			}

			controller.restart();
		}
	};

	const waiting = (bool: boolean) => {
		document.documentElement.classList.toggle('wait', bool);
	};

	const setBoardPointer = (which: string) => {
		const second = document.querySelector('#secondBoard');

		if (which === 'player') {
			second.classList.add('boardOutline');
		} else if (which === 'computer') {
			second.classList.remove('boardOutline');
		}
	};

	const removeBoardPointer = () => {
		const second = document.querySelector('#secondBoard');
		second.classList.remove('boardOutline');
	};

	pVcBtn.addEventListener('click', () => handleGameMode(pVcBtn, cVcBtn));
	cVcBtn.addEventListener('click', () => handleGameMode(cVcBtn, pVcBtn));
	newGameBtn.addEventListener('click', handleNewGame);

	rotateBtn.addEventListener('click', () => controller.rotateShip());
	startBtn.addEventListener('click', () => controller.start());
	randomBtn.addEventListener('click', () => controller.placeShipsRandomly(controller.humanGameboard));

	// ############################################################################################

	const convertToShipElement = async (shipCells: Cell[]) => {
		const shipElement = document.createElement('div');
		const shipName = shipCells[0].takenBy.name.toLowerCase();
		const shipSize = shipCells[0].takenBy.size;
		const isVertical = shipCells[0].takenBy.isVertical;

		console.log(isVertical);

		shipElement.classList.add('ship', shipName);

		await new Promise((resolve) => setTimeout(resolve, 0));

		const setShipStyle = () => {
			if (!isVertical) {
				shipElement.style.width = shipSize * (cellSize / 16) + 'rem';
				shipElement.style.height = cellSize / 16 + 'rem';
			} else if (isVertical) {
				shipElement.style.width = cellSize / 16 + 'rem';
				shipElement.style.height = shipSize * (cellSize / 16) + 'rem';
			}
		};

		let cellSize = (document.querySelector('.board .cell') as HTMLElement).getBoundingClientRect().width;

		setShipStyle();

		window.addEventListener('resize', function () {
			cellSize = (document.querySelector('.board .cell') as HTMLElement).getBoundingClientRect().width;

			setShipStyle();
		});

		const firstCell = document.querySelector(`#tempBoard .cell[data-col="${shipCells[0].col}"][data-row="${shipCells[0].row}"]`);
		firstCell.appendChild(shipElement);
	};

	const removeShipElements = () => {
		const shipElements = document.querySelectorAll('.ship');

		shipElements.forEach((shipElement) => {
			shipElement.remove();
		});
	};

	return {
		renderBoard,
		refreshBoard,
		handleUserInput,
		pVcBtn,
		cVcBtn,
		waiting,
		setBoardPointer,
		removeBoardPointer,
		convertToShipElement,
		removeShipElements,
	};
})();

export default ui;
