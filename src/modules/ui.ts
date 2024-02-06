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
		} else if (gameboard === controller.computerGameboard) {
			board.id = 'secondBoard';
		} else if (gameboard === controller.tempBoard) {
			board.id = 'tempBoard';
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

	const handleGameMode = (selectedElement: HTMLButtonElement, deselectedElement: HTMLButtonElement) => {
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

	const createShipOverlay = (gameboardName: string, ships: Cell[]) => {
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

			let board;

			if (gameboardName === 'first') {
				board = 'firstBoard';
			} else if (gameboardName === 'temp') {
				board = 'tempBoard';
			}
			const firstCellElement = document.querySelector(`#${board} .cell[data-col="${firstCell.col}"][data-row="${firstCell.row}"]`);
			firstCellElement.appendChild(shipElement);
		});
	};

	const dragAndDrop = (firstGameboard: Gameboard, tempGameboard: Gameboard, ships: Ship[]) => {
		let shipName: string;
		let shipSize: number;
		let grabPointX = 0;
		let grabPointY = 0;
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
			draggable.addEventListener('mousedown', handleMousedown);
			draggable.addEventListener('mouseup', handleMouseup);
			draggable.addEventListener('dragstart', handleDragStart);
			draggable.addEventListener('dragend', handleDragEnd);
		});

		const firstBoardElement = document.querySelector('#firstBoard');
		const tempBoardElement = document.querySelector('#tempBoard');
		const firstBoardCells = firstBoardElement.querySelectorAll('.cell');
		const tempBoardCells = tempBoardElement.querySelectorAll('.cell');

		let lastDragged: HTMLElement[] = null;

		function handleMousedown(e: Event) {
			firstGameboard.removeReservedSpace(firstGameboard);
			tempGameboard.removeReservedSpace(tempGameboard);

			const targetShipName = (e.target as Element).getAttribute('data-name');

			let updatedShipsPlacedFirst = firstGameboard.shipsPlaced.filter((ship) => {
				return targetShipName !== ship.takenBy.name.toLowerCase();
			});

			let updatedShipsPlacedTemp = tempGameboard.shipsPlaced.filter((ship) => {
				return targetShipName !== ship.takenBy.name.toLowerCase();
			});

			updatedShipsPlacedFirst.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			updatedShipsPlacedTemp.forEach((ship) => {
				tempGameboard.reserveSpace(tempGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(tempGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('temp', tempGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, tempGameboard, controller.humanShips);
		}

		function handleMouseup() {
			firstGameboard.shipsPlaced.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			tempGameboard.shipsPlaced.forEach((ship) => {
				tempGameboard.reserveSpace(tempGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(tempGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('temp', tempGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, tempGameboard, controller.humanShips);
		}

		async function handleDragStart(e: DragEvent) {
			await new Promise((resolve) => setTimeout(resolve, 0));

			const target = e.target as HTMLElement;
			target.style.visibility = 'hidden';
			this.classList.add('dragging');

			shipName = target.getAttribute('data-name')!;
			shipSize = Number(target.getAttribute('data-size'));
			grabPointX = e.offsetX;
			grabPointY = e.offsetY;
			shipObj = shipNameToObj[shipName as keyof typeof shipNameToObj];
			orientation = shipObj.isVertical ? 'vertical' : 'horizontal';

			if (target.closest('.board').id === 'firstBoard') {
				firstGameboard.removeShip(shipObj, firstGameboard);
			}

			if (target.closest('.board').id === 'tempBoard') {
				tempGameboard.removeShip(shipObj, tempGameboard);
			}
		}

		function handleDragOver(index: number) {
			return function (e: Event) {
				const target = e.target as HTMLElement;

				if (target.closest('.board').id === 'firstBoard') {
					e.preventDefault();

					if (shipObj) {
						let startCell =
							index - (shipObj.isVertical ? Math.floor(grabPointY / this.offsetHeight) * 10 : Math.floor(grabPointX / this.offsetWidth));

						const toHighlight: Element[] = [];
						for (let i = 0; i < shipSize; i++) {
							let cellIndex = shipObj.isVertical ? startCell + i * 10 : startCell + i;
							if (firstBoardCells[cellIndex]) {
								toHighlight.push(firstBoardCells[cellIndex]);
								highlightedCells.push(firstBoardCells[cellIndex]);
							}
						}
						if (isValidPlacement(toHighlight)) {
							toHighlight.forEach((cell: HTMLElement) => {
								cell.classList.add('highlight');
							});
							if (!lastDragged) {
								lastDragged = getLastShipSizeElements(highlightedCells, shipSize);
							}
						}
						// else {
						// 	console.log('ship is on the edge');
						// }
					}
				}
				if (target.closest('.board').id === 'tempBoard') {
					e.preventDefault();

					if (shipObj) {
						let startCell =
							index - (shipObj.isVertical ? Math.floor(grabPointY / this.offsetHeight) * 10 : Math.floor(grabPointX / this.offsetWidth));

						const toHighlight: Element[] = [];
						for (let i = 0; i < shipSize; i++) {
							let cellIndex = shipObj.isVertical ? startCell + i * 10 : startCell + i;

							if (tempBoardCells[cellIndex]) {
								toHighlight.push(tempBoardCells[cellIndex]);
								highlightedCells.push(tempBoardCells[cellIndex]);
							}
						}

						if (isValidPlacement(toHighlight)) {
							toHighlight.forEach((cell: HTMLElement) => {
								cell.classList.add('highlight');
							});
							if (!lastDragged) {
								lastDragged = getLastShipSizeElements(highlightedCells, shipSize);
							}
						}
						// else {
						// 	console.log('ship is on the edge');
						// }
					}
				}
			};
		}

		function handleDragLeave() {
			highlightedCells.forEach((highlightedCell) => {
				highlightedCell.classList.remove('highlight');
			});
			highlightedCells = [];
		}

		function handleDrop(e: Event) {
			highlightedCells.forEach((highlightedCell) => {
				highlightedCell.classList.remove('highlight');
			});

			const last = getLastShipSizeElements(highlightedCells, shipSize);
			const target = e.target as HTMLElement;

			if (target.closest('.board').id === 'firstBoard') {
				if (shipObj && lastDragged !== null) {
					if (firstGameboard.canBePlaced(shipObj.size, last[0].dataset.col, last[0].dataset.row, orientation)) {
						firstGameboard.placeShip(shipObj, last[0].dataset.col, last[0].dataset.row, orientation);
						firstGameboard.reserveSpace(firstGameboard, last[0].dataset.col, last[0].dataset.row);
					} else {
						firstGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						firstGameboard.reserveSpace(firstGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);
					}
				}
			}

			if (target.closest('.board').id === 'tempBoard') {
				if (shipObj && lastDragged !== null) {
					if (tempGameboard.canBePlaced(shipObj.size, last[0].dataset.col, last[0].dataset.row, orientation)) {
						tempGameboard.placeShip(shipObj, last[0].dataset.col, last[0].dataset.row, orientation);
						tempGameboard.reserveSpace(tempGameboard, last[0].dataset.col, last[0].dataset.row);
					} else {
						tempGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						tempGameboard.reserveSpace(tempGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);
					}
				}
			}

			firstGameboard.removeReservedSpace(firstGameboard);
			tempGameboard.removeReservedSpace(tempGameboard);

			firstGameboard.shipsPlaced.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			tempGameboard.shipsPlaced.forEach((ship) => {
				tempGameboard.reserveSpace(tempGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(tempGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('temp', tempGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, tempGameboard, controller.humanShips);

			lastDragged = null;
		}

		function handleDragEnd(e: DragEvent) {
			const target = e.target as HTMLElement;
			target.style.visibility = 'visible';
			this.classList.remove('dragging');

			if (highlightedCells.length === 0) {
				if (target.closest('.board').id === 'firstBoard') {
					if (lastDragged && firstGameboard.canBePlaced(shipObj.size, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation)) {
						firstGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						firstGameboard.reserveSpace(firstGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);

						refreshBoard(firstGameboard);
						refreshBoard(tempGameboard);
						createShipOverlay('first', firstGameboard.shipsPlaced);
						createShipOverlay('temp', tempGameboard.shipsPlaced);
						dragAndDrop(firstGameboard, tempGameboard, controller.humanShips);
					}
				} else if (target.closest('.board').id === 'tempBoard') {
					if (lastDragged && tempGameboard.canBePlaced(shipObj.size, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation)) {
						tempGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						tempGameboard.reserveSpace(tempGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);

						refreshBoard(firstGameboard);
						refreshBoard(tempGameboard);
						createShipOverlay('first', firstGameboard.shipsPlaced);
						createShipOverlay('temp', tempGameboard.shipsPlaced);
						dragAndDrop(firstGameboard, tempGameboard, controller.humanShips);
					}
				}
			}
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

		firstBoardCells.forEach((cell: HTMLElement, index) => {
			cell.addEventListener('dragover', handleDragOver(index));
			cell.addEventListener('dragleave', handleDragLeave);
			cell.addEventListener('drop', handleDrop);
		});

		tempBoardCells.forEach((cell: HTMLElement, index) => {
			cell.addEventListener('dragover', handleDragOver(index));
			cell.addEventListener('dragleave', handleDragLeave);
			cell.addEventListener('drop', handleDrop);
		});
	};

	pVcBtn.addEventListener('click', () => handleGameMode(pVcBtn, cVcBtn));
	cVcBtn.addEventListener('click', () => handleGameMode(cVcBtn, pVcBtn));
	newGameBtn.addEventListener('click', handleNewGame);

	rotateBtn.addEventListener('click', () => controller.rotateShip());
	startBtn.addEventListener('click', () => controller.start());

	randomBtn.addEventListener('click', () => {
		controller.tempBoard.clearBoard();
		refreshBoard(controller.tempBoard);
		controller.randomizeShipsPlacement('first', controller.humanGameboard);
		dragAndDrop(controller.humanGameboard, controller.tempBoard, controller.humanShips);
	});

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
