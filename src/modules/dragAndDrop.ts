import { Gameboard, Ship } from './types';
import ui from './ui';
import controller from './controller';
import sounds from './sounds';

const dragAndDrop = (firstGameboard: Gameboard, secondGameboard: Gameboard, ships: Ship[]) => {
	const firstBoardElement = document.querySelector('#firstBoard');
	const secondBoardElement = document.querySelector('#secondBoard');
	const firstBoardCells = firstBoardElement.querySelectorAll('.cell');
	const secondBoardCells = secondBoardElement.querySelectorAll('.cell');

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

	let lastDragged: HTMLElement[] = null;
	const draggables = document.querySelectorAll('.draggable');

	function getNonShipCells(boardCells: NodeListOf<Element>): Element[] {
		const boardCellsArray = Array.from(boardCells);
		return boardCellsArray.filter((cell) => !cell.classList.contains('taken'));
	}

	const nonShipCells: Element[] = [...getNonShipCells(firstBoardCells), ...getNonShipCells(secondBoardCells)];

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

	function getGameboard(e: Event): { target: HTMLElement; gameboard: Gameboard } {
		const target = e.target as HTMLElement;
		let gameboard: Gameboard;

		const boardId = target.closest('.board').id;

		if (boardId === 'firstBoard') {
			gameboard = firstGameboard;
		}

		if (boardId === 'secondBoard') {
			gameboard = secondGameboard;
		}

		return { target, gameboard };
	}

	function reserveSpaceForRemainingShips(gameboard: Gameboard, e: Event) {
		const { target } = getGameboard(e);
		const targetShipName = target.getAttribute('data-name');

		let remainingShips = gameboard.shipsPlaced.filter((ship) => {
			return targetShipName !== ship.takenBy.name.toLowerCase();
		});

		remainingShips.forEach((ship) => {
			gameboard.reserveSpace(gameboard, ship.col, ship.row);
		});
	}

	function setShipAttributes(e: DragEvent, target: HTMLElement) {
		shipName = target.getAttribute('data-name');
		shipSize = Number(target.getAttribute('data-size'));
		grabPointX = e.offsetX;
		grabPointY = e.offsetY;
		shipObj = shipNameToObj[shipName as keyof typeof shipNameToObj];
		orientation = shipObj.isVertical ? 'vertical' : 'horizontal';

		return { shipName, shipObj };
	}

	function preventOffBoardPlacement(target: HTMLElement, e: DragEvent) {
		if (highlightedCells.length === 0) {
			const board = target.closest('.board');

			if (board) {
				let { gameboard } = getGameboard(e);

				if (board.id === 'firstBoard') {
					gameboard = firstGameboard;
				} else if (board.id === 'secondBoard') {
					gameboard = secondGameboard;
				}

				if (gameboard && lastDragged && gameboard.canBePlaced(shipObj.size, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation)) {
					gameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
					gameboard.reserveSpace(gameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);
					controller.renew();
				}
			}
		}
	}

	function getStartCell(index: number, shipObj: Ship, e: Event) {
		const { target } = getGameboard(e);
		return index - (shipObj.isVertical ? Math.floor(grabPointY / target.offsetHeight) * 10 : Math.floor(grabPointX / target.offsetWidth));
	}

	function getBoardCells(boardId: string) {
		return boardId === 'firstBoard' ? firstBoardCells : secondBoardCells;
	}

	function highlightCells(toHighlight: Element[]) {
		toHighlight.forEach((cell: HTMLElement) => {
			cell.classList.add('highlight');
		});
	}

	function highlightCellsOnBoard(shipObj: Ship, startCell: number, boardCells: NodeListOf<Element>, toHighlight: Element[]) {
		for (let i = 0; i < shipSize; i++) {
			let cellIndex = shipObj.isVertical ? startCell + i * 10 : startCell + i;

			if (boardCells[cellIndex]) {
				toHighlight.push(boardCells[cellIndex]);
				highlightedCells.push(boardCells[cellIndex]);
			}
		}
	}

	function removeHighlight() {
		highlightedCells.forEach((highlightedCell) => highlightedCell.classList.remove('highlight'));
	}

	function isBoardValid(boardId: string) {
		return boardId === 'firstBoard' || boardId === 'secondBoard';
	}

	function placeShipOnBoard(gameboard: Gameboard, shipObj: Ship, last: HTMLElement[], orientation: string) {
		if (gameboard.canBePlaced(shipObj.size, last[0].dataset.col, last[0].dataset.row, orientation)) {
			gameboard.placeShip(shipObj, last[0].dataset.col, last[0].dataset.row, orientation);
			gameboard.reserveSpace(gameboard, last[0].dataset.col, last[0].dataset.row);
		} else {
			gameboard.placeShip(shipObj, lastDragged[0].dataset.col, lastDragged[0].dataset.row, orientation);
			gameboard.reserveSpace(gameboard, lastDragged[0].dataset.col, lastDragged[0].dataset.row);
		}
	}

	function handleMousedown(e: Event) {
		const { gameboard } = getGameboard(e);
		gameboard.removeReservedSpace(gameboard);
		reserveSpaceForRemainingShips(gameboard, e);
		controller.renew();
		ui.setInitMessage();

		if ((e as MouseEvent).button === 0) {
			sounds.grab.play();
		}
	}

	async function handleDragStart(e: DragEvent) {
		await new Promise((resolve) => setTimeout(resolve, 0));
		const { target, gameboard } = getGameboard(e);
		target.style.visibility = 'hidden';
		setShipAttributes(e, target);
		gameboard.removeShip(shipObj, gameboard);
		ui.clearShip(shipObj, gameboard);
	}

	function handleDragOver(index: number) {
		return function (e: Event) {
			const { target } = getGameboard(e);
			const boardId = target.closest('.board').id;

			if (isBoardValid(boardId)) {
				e.preventDefault();

				if (shipObj) {
					const startCell = getStartCell(index, shipObj, e);
					const boardCells = getBoardCells(boardId);

					const toHighlight: Element[] = [];
					highlightCellsOnBoard(shipObj, startCell, boardCells, toHighlight);

					if (isValidPlacement(toHighlight)) {
						highlightCells(toHighlight);

						if (!lastDragged) {
							lastDragged = getLastShipSizeElements(highlightedCells, shipSize);
						}
					}
				}
			}
		};
	}

	function handleDragLeave() {
		removeHighlight();
		highlightedCells.length = 0;
	}

	function handleDrop(e: Event) {
		removeHighlight();

		const last = getLastShipSizeElements(highlightedCells, shipSize);
		const { target, gameboard } = getGameboard(e);
		const boardId = target.closest('.board').id;

		if (isBoardValid(boardId) && shipObj && lastDragged !== null) {
			placeShipOnBoard(gameboard, shipObj, last, orientation);
		}

		gameboard.removeReservedSpace(gameboard);
		gameboard.reserveSpaceForAll(gameboard);
		controller.renew();
		ui.canBeStarted();
		ui.setStartMessage();
		lastDragged = null;

		sounds.drop.play();
	}

	function handleDragEnd(e: DragEvent) {
		const target = e.target as HTMLElement;
		target.style.visibility = 'visible';

		preventOffBoardPlacement(target, e);

		if (ui.canBeStarted()) {
			ui.fillCells('second');
		}

		ui.setStartMessage();
	}

	function handleMouseup(e: Event) {
		const { gameboard } = getGameboard(e);
		gameboard.reserveSpaceForAll(gameboard);
		controller.renew();
		ui.setStartMessage();
	}

	function handleRotate(e: DragEvent) {
		e.preventDefault();

		const { target, gameboard } = getGameboard(e);
		const { shipName, shipObj } = setShipAttributes(e, target);
		const current = gameboard.shipsPlaced.filter((ship) => ship.takenBy.name.toLowerCase() === shipName);

		gameboard.removeShip(shipObj, gameboard);
		gameboard.removeReservedSpace(gameboard);
		gameboard.reserveSpaceForAll(gameboard);

		shipObj.rotate();
		orientation = shipObj.isVertical ? 'vertical' : 'horizontal';

		if (!gameboard.canBePlaced(shipObj.size, current[0].col, current[0].row, orientation)) {
			shipObj.rotate();
			orientation = shipObj.isVertical ? 'vertical' : 'horizontal';
		}

		gameboard.placeShip(shipObj, current[0].col, current[0].row, orientation);
		gameboard.reserveSpaceForAll(gameboard);
		controller.renew();

		if (ui.canBeStarted()) {
			ui.fillCells('second');
		}

		sounds.rotate.play();
	}

	function blockRightClick(e: Event) {
		e.preventDefault();
	}

	function addEventListenersToCells(cells: NodeListOf<Element>) {
		cells.forEach((cell, index) => {
			cell.addEventListener('dragover', handleDragOver(index));
			cell.addEventListener('dragleave', handleDragLeave);
			cell.addEventListener('drop', handleDrop);
		});
	}

	addEventListenersToCells(firstBoardCells);
	addEventListenersToCells(secondBoardCells);

	draggables.forEach((draggable) => {
		draggable.addEventListener('mousedown', handleMousedown);
		draggable.addEventListener('dragstart', handleDragStart);

		draggable.addEventListener('dragend', handleDragEnd);
		draggable.addEventListener('mouseup', handleMouseup);

		draggable.addEventListener('contextmenu', handleRotate);
		nonShipCells.forEach((cell) => cell.addEventListener('contextmenu', blockRightClick));
	});
};

export default dragAndDrop;
