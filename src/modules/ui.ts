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

	const startBtn = document.querySelector('#start') as HTMLButtonElement;
	const randomBtn = document.querySelector('#randomPlacement') as HTMLButtonElement;

	const allBtns = [pVcBtn, newGameBtn, cVcBtn, startBtn, randomBtn];

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
		pVcBtn.textContent = 'Restarting...';

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

		canBeStarted();
	};

	const handleCvC = async () => {
		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));
		cVcBtn.textContent = 'Starting...';

		await new Promise((resolve) => setTimeout(resolve, 1000));

		cVcBtn.textContent = 'Computer vs Computer';
		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);

		startBtn.disabled = true;
		randomBtn.disabled = true;
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
			} else if (gameboardName === 'second') {
				board = 'secondBoard';
			}

			const firstCellElement = document.querySelector(`#${board} .cell[data-col="${firstCell.col}"][data-row="${firstCell.row}"]`);
			firstCellElement.appendChild(shipElement);
		});
	};

	const canBeStarted = () => {
		if (controller.humanGameboard.shipsPlaced.length === 5 && controller.computerGameboard.shipsPlaced.length === 0) {
			startBtn.disabled = false;
		} else {
			startBtn.disabled = true;
		}
	};

	const dragAndDrop = (firstGameboard: Gameboard, secondGameboard: Gameboard, ships: Ship[]) => {
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

		const firstBoardElement = document.querySelector('#firstBoard');
		const secondBoardElement = document.querySelector('#secondBoard');
		const firstBoardCells = firstBoardElement.querySelectorAll('.cell');
		const secondBoardCells = secondBoardElement.querySelectorAll('.cell');

		const nonShipCells: Element[] = [];

		for (let cell of firstBoardCells) {
			if (!cell.classList.contains('taken')) {
				nonShipCells.push(cell);
			}
		}

		for (let cell of secondBoardCells) {
			if (!cell.classList.contains('taken')) {
				nonShipCells.push(cell);
			}
		}

		const draggables = document.querySelectorAll('.draggable');
		draggables.forEach((draggable) => {
			draggable.addEventListener('mousedown', handleMousedown);
			draggable.addEventListener('mouseup', handleMouseup);

			draggable.addEventListener('dragstart', handleDragStart);
			draggable.addEventListener('dragend', handleDragEnd);

			draggable.addEventListener('contextmenu', handleRotate);

			nonShipCells.forEach((cell) => {
				cell.addEventListener('contextmenu', blockRightClick);
			});
		});

		let lastDragged: HTMLElement[] = null;

		function handleMousedown(e: Event) {
			firstGameboard.removeReservedSpace(firstGameboard);
			secondGameboard.removeReservedSpace(secondGameboard);

			const targetShipName = (e.target as HTMLElement).getAttribute('data-name');

			let updatedShipsPlacedFirst = firstGameboard.shipsPlaced.filter((ship) => {
				return targetShipName !== ship.takenBy.name.toLowerCase();
			});

			let updatedShipsPlacedTemp = secondGameboard.shipsPlaced.filter((ship) => {
				return targetShipName !== ship.takenBy.name.toLowerCase();
			});

			updatedShipsPlacedFirst.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			updatedShipsPlacedTemp.forEach((ship) => {
				secondGameboard.reserveSpace(secondGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(secondGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('second', secondGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
		}

		function handleMouseup() {
			firstGameboard.shipsPlaced.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			secondGameboard.shipsPlaced.forEach((ship) => {
				secondGameboard.reserveSpace(secondGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(secondGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('second', secondGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
		}

		async function handleDragStart(e: DragEvent) {
			await new Promise((resolve) => setTimeout(resolve, 0));

			const target = e.target as HTMLElement;
			target.style.visibility = 'hidden';
			this.classList.add('dragging');

			shipName = target.getAttribute('data-name');
			shipSize = Number(target.getAttribute('data-size'));
			grabPointX = e.offsetX;
			grabPointY = e.offsetY;
			shipObj = shipNameToObj[shipName as keyof typeof shipNameToObj];
			orientation = shipObj.isVertical ? 'vertical' : 'horizontal';

			if (target.closest('.board').id === 'firstBoard') {
				firstGameboard.removeShip(shipObj, firstGameboard);
			}

			if (target.closest('.board').id === 'secondBoard') {
				secondGameboard.removeShip(shipObj, secondGameboard);
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
				if (target.closest('.board').id === 'secondBoard') {
					e.preventDefault();

					if (shipObj) {
						let startCell =
							index - (shipObj.isVertical ? Math.floor(grabPointY / this.offsetHeight) * 10 : Math.floor(grabPointX / this.offsetWidth));

						const toHighlight: Element[] = [];
						for (let i = 0; i < shipSize; i++) {
							let cellIndex = shipObj.isVertical ? startCell + i * 10 : startCell + i;

							if (secondBoardCells[cellIndex]) {
								toHighlight.push(secondBoardCells[cellIndex]);
								highlightedCells.push(secondBoardCells[cellIndex]);
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

			if (target.closest('.board').id === 'secondBoard') {
				if (shipObj && lastDragged !== null) {
					if (secondGameboard.canBePlaced(shipObj.size, last[0].dataset.col, last[0].dataset.row, orientation)) {
						secondGameboard.placeShip(shipObj, last[0].dataset.col, last[0].dataset.row, orientation);
						secondGameboard.reserveSpace(secondGameboard, last[0].dataset.col, last[0].dataset.row);
					} else {
						secondGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						secondGameboard.reserveSpace(secondGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);
					}
				}
			}

			firstGameboard.removeReservedSpace(firstGameboard);
			secondGameboard.removeReservedSpace(secondGameboard);

			firstGameboard.shipsPlaced.forEach((ship) => {
				firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
			});

			secondGameboard.shipsPlaced.forEach((ship) => {
				secondGameboard.reserveSpace(secondGameboard, ship.col, ship.row);
			});

			refreshBoard(firstGameboard);
			refreshBoard(secondGameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('second', secondGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
			canBeStarted();

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
						refreshBoard(secondGameboard);
						createShipOverlay('first', firstGameboard.shipsPlaced);
						createShipOverlay('second', secondGameboard.shipsPlaced);
						dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
					}
				} else if (target.closest('.board').id === 'secondBoard') {
					if (lastDragged && secondGameboard.canBePlaced(shipObj.size, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation)) {
						secondGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
						secondGameboard.reserveSpace(secondGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);

						refreshBoard(firstGameboard);
						refreshBoard(secondGameboard);
						createShipOverlay('first', firstGameboard.shipsPlaced);
						createShipOverlay('second', secondGameboard.shipsPlaced);
						dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
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

		secondBoardCells.forEach((cell: HTMLElement, index) => {
			cell.addEventListener('dragover', handleDragOver(index));
			cell.addEventListener('dragleave', handleDragLeave);
			cell.addEventListener('drop', handleDrop);
		});

		function handleRotate(e: Event) {
			e.preventDefault();

			const target = e.target as HTMLElement;

			let gameboard: Gameboard;

			if (target.closest('.board').id === 'firstBoard') {
				gameboard = firstGameboard;
			}

			if (target.closest('.board').id === 'secondBoard') {
				gameboard = secondGameboard;
			}

			shipName = target.getAttribute('data-name');
			shipSize = Number(target.getAttribute('data-size'));

			shipObj = shipNameToObj[shipName as keyof typeof shipNameToObj];

			const tempShip = shipObj;

			const current = gameboard.shipsPlaced.filter((ship) => ship.takenBy.name.toLowerCase() === shipName);

			gameboard.removeShip(shipObj, gameboard);
			gameboard.removeReservedSpace(gameboard);

			gameboard.shipsPlaced.forEach((ship) => {
				gameboard.reserveSpace(gameboard, ship.col, ship.row);
			});

			tempShip.rotate();
			orientation = tempShip.isVertical ? 'vertical' : 'horizontal';

			if (gameboard.canBePlaced(tempShip.size, current[0].col, current[0].row, orientation)) {
				gameboard.placeShip(tempShip, current[0].col, current[0].row, orientation);
			} else {
				tempShip.rotate();
				orientation = tempShip.isVertical ? 'vertical' : 'horizontal';
				gameboard.placeShip(tempShip, current[0].col, current[0].row, orientation);
			}

			gameboard.shipsPlaced.forEach((ship) => {
				gameboard.reserveSpace(gameboard, ship.col, ship.row);
			});

			refreshBoard(gameboard);

			createShipOverlay('first', firstGameboard.shipsPlaced);
			createShipOverlay('second', secondGameboard.shipsPlaced);

			dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
		}

		function blockRightClick(e: Event) {
			e.preventDefault();
		}
	};

	pVcBtn.addEventListener('click', () => handleGameMode(pVcBtn, cVcBtn));

	cVcBtn.addEventListener('click', () => {
		handleGameMode(cVcBtn, pVcBtn);

		const second = document.querySelector('#secondBoard');
		second.classList.remove('hide');
	});

	newGameBtn.addEventListener('click', handleNewGame);

	startBtn.addEventListener('click', () => {
		controller.start();

		const second = document.querySelector('#secondBoard');
		second.classList.add('hide');

		startBtn.disabled = true;
		randomBtn.disabled = true;
	});

	randomBtn.addEventListener('click', () => {
		controller.computerGameboard.clearBoard();
		refreshBoard(controller.computerGameboard);
		controller.randomizeShipsPlacement('first', controller.humanGameboard);
		dragAndDrop(controller.humanGameboard, controller.computerGameboard, controller.humanShips);
		canBeStarted();
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
		canBeStarted,
	};
})();

export default ui;
