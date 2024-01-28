import { Gameboard, Ship, Cell } from './types';

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
		let boardId;
		if (gameboard === controller.humanGameboard) {
			boardId = 'firstBoard';
		} else if (gameboard === controller.computerGameboard) {
			boardId = 'secondBoard';
		} else if (gameboard === controller.tempBoard) {
			boardId = 'tempBoard';
		}
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
	randomBtn.addEventListener('click', () => controller.randomizeShipsPlacement(controller.humanGameboard));

	const createShipOverlay = async (ships: Cell[]) => {
		ships.forEach((firstCell) => {
			const shipElement = document.createElement('div');
			const shipName = firstCell.takenBy.name.toLowerCase();
			const shipSize = firstCell.takenBy.size;
			const isVertical = firstCell.takenBy.isVertical;

			shipElement.classList.add('ship', shipName);
			shipElement.setAttribute('data-size', `${shipSize}`);
			shipElement.setAttribute('data-name', `${shipName}`);
			shipElement.setAttribute('draggable', 'true');
			shipElement.classList.add('draggable');

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

			const firstCellElement = document.querySelector(`#tempBoard .cell[data-col="${firstCell.col}"][data-row="${firstCell.row}"]`);
			firstCellElement.appendChild(shipElement);
		});
	};

	const dragAndDrop = (gameboard: Gameboard, ships: Ship[]) => {
		let shipName: string;
		let shipSize: number;
		let grabPoint = 0;
		let shipObj: Ship;
		let orientation: string;
		let highlightedCells: Element[] = [];

		const shipNameToObj = {
			carrier: ships[0],
			battleship: ships[1],
			destroyer: ships[2],
			submarine: ships[3],
			patrolboat: ships[4],
		};

		const draggables = document.querySelectorAll('.draggable');
		draggables.forEach((draggable) => {
			draggable.addEventListener('dragstart', handleDragStart);
			draggable.addEventListener('dragend', handleDragEnd);
		});

		const tempBoardElement = document.querySelector('#tempBoard');
		const cells = tempBoardElement.querySelectorAll('.cell');

		let lastDragged: any = null;

		cells.forEach((cell: HTMLElement, index) => {
			cell.addEventListener('dragover', handleDragOver(index));
			cell.addEventListener('dragleave', handleDragLeave);
			cell.addEventListener('drop', handleDrop);
		});

		function handleDragStart(e: DragEvent) {
			setTimeout(() => {
				const target = e.target as HTMLElement;

				target.style.visibility = 'hidden';

				this.classList.add('dragging');
				shipName = target.getAttribute('data-name')!;
				shipSize = Number(target.getAttribute('data-size'));
				grabPoint = e.offsetX;
				shipObj = shipNameToObj[shipName as keyof typeof shipNameToObj];
				orientation = shipObj.isVertical ? 'vertical' : 'horizontal';

				gameboard.removeShip(shipObj, gameboard);
			}, 0);
		}

		function handleDragEnd(e: DragEvent) {
			const target = e.target as HTMLElement;
			target.style.visibility = 'visible';

			this.classList.remove('dragging');
		}

		function handleDragOver(index: number) {
			return function (e: Event) {
				e.preventDefault();
				let startCell = index - Math.floor(grabPoint / this.offsetWidth);

				const toHighlight: Element[] = [];

				for (let i = 0; i < shipSize; i++) {
					if (cells[startCell + i]) {
						toHighlight.push(cells[startCell + i]);
						highlightedCells.push(cells[startCell + i]);
					}
				}

				if (isValidPlacement(toHighlight)) {
					toHighlight.forEach((cell: HTMLElement) => {
						cell.classList.add('highlight');
					});

					if (!lastDragged) {
						lastDragged = getLastShipSizeElements(highlightedCells, shipSize);
					}
				} else {
					console.error('ship out of board or ship on ship');
				}
			};
		}

		function handleDragLeave() {
			highlightedCells.forEach((highlightedCell) => {
				highlightedCell.classList.remove('highlight');
			});
			highlightedCells = [];
		}

		function handleDrop() {
			highlightedCells.forEach((highlightedCell) => {
				highlightedCell.classList.remove('highlight');
			});

			const last = getLastShipSizeElements(highlightedCells, shipSize);

			if (gameboard.canBePlaced(shipObj.size, last[0].dataset.col, last[0].dataset.row, orientation)) {
				gameboard.placeShip(shipObj, last[0].dataset.col, last[0].dataset.row, orientation);
			} else {
				gameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
			}

			refreshBoard(gameboard);
			createShipOverlay(gameboard.shipsPlaced);
			dragAndDrop(gameboard, controller.humanShips);

			lastDragged = null;
		}

		function isValidPlacement(toHighlight: Element[]) {
			return (
				toHighlight.every((cell: HTMLElement) => cell.classList.contains('empty')) &&
				(toHighlight.every((cell: HTMLElement) => cell.dataset.col === (toHighlight[0] as HTMLElement).dataset.col) ||
					toHighlight.every((cell: HTMLElement) => cell.dataset.row === (toHighlight[0] as HTMLElement).dataset.row)) &&
				toHighlight.length === shipSize &&
				toHighlight.every((cell: HTMLElement) => cell.dataset.col >= 'A' && cell.dataset.col <= 'J') &&
				toHighlight.every((cell: HTMLElement) => Number(cell.dataset.row) >= 1 && Number(cell.dataset.row) <= 10)
			);
		}

		function getLastShipSizeElements(highlightedCells: Element[], shipSize: number) {
			return highlightedCells.slice(Math.min(highlightedCells.length - shipSize, 0)) as HTMLElement[];
		}
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
		createShipOverlay,
		dragAndDrop,
	};
})();

export default ui;
