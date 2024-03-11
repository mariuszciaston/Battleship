import { Gameboard, Ship } from './types';

import ui from './ui';
import controller from './controller';

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

		ui.refreshBoard(firstGameboard);
		ui.refreshBoard(secondGameboard);

		ui.createShipOverlay('first', firstGameboard.shipsPlaced);
		ui.createShipOverlay('second', secondGameboard.shipsPlaced);

		dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
	}

	function handleMouseup() {
		firstGameboard.shipsPlaced.forEach((ship) => {
			firstGameboard.reserveSpace(firstGameboard, ship.col, ship.row);
		});

		secondGameboard.shipsPlaced.forEach((ship) => {
			secondGameboard.reserveSpace(secondGameboard, ship.col, ship.row);
		});

		ui.refreshBoard(firstGameboard);
		ui.refreshBoard(secondGameboard);

		ui.createShipOverlay('first', firstGameboard.shipsPlaced);
		ui.createShipOverlay('second', secondGameboard.shipsPlaced);

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
					let startCell = index - (shipObj.isVertical ? Math.floor(grabPointY / this.offsetHeight) * 10 : Math.floor(grabPointX / this.offsetWidth));

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
					let startCell = index - (shipObj.isVertical ? Math.floor(grabPointY / this.offsetHeight) * 10 : Math.floor(grabPointX / this.offsetWidth));

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

		ui.refreshBoard(firstGameboard);
		ui.refreshBoard(secondGameboard);

		ui.createShipOverlay('first', firstGameboard.shipsPlaced);
		ui.createShipOverlay('second', secondGameboard.shipsPlaced);

		dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
		ui.canBeStarted();
		ui.setStartMessage();

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

					ui.refreshBoard(firstGameboard);
					ui.refreshBoard(secondGameboard);
					ui.createShipOverlay('first', firstGameboard.shipsPlaced);
					ui.createShipOverlay('second', secondGameboard.shipsPlaced);
					dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);
				}
			} else if (target.closest('.board').id === 'secondBoard') {
				if (lastDragged && secondGameboard.canBePlaced(shipObj.size, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation)) {
					secondGameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
					secondGameboard.reserveSpace(secondGameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);

					ui.refreshBoard(firstGameboard);
					ui.refreshBoard(secondGameboard);
					ui.createShipOverlay('first', firstGameboard.shipsPlaced);
					ui.createShipOverlay('second', secondGameboard.shipsPlaced);
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

		ui.refreshBoard(gameboard);

		ui.createShipOverlay('first', firstGameboard.shipsPlaced);
		ui.createShipOverlay('second', secondGameboard.shipsPlaced);

		dragAndDrop(firstGameboard, secondGameboard, controller.humanShips);

		if (ui.canBeStarted()) {
			ui.fillCells('second');
		}
	}

	function blockRightClick(e: Event) {
		e.preventDefault();
	}
};

export default dragAndDrop;
