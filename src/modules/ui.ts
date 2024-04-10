import { Gameboard, Ship, Cell } from './types';
import dragAndDrop from './dragAndDrop';
import controller from './controller';
import sounds from './sounds';

const ui = (() => {
	const statusBox = document.querySelector('#messageBox p');
	const boards = document.querySelector('#boards');

	const pVcBtn = document.querySelector('#playerVsComputer') as HTMLButtonElement;
	const newGameBtn = document.querySelector('#newGame') as HTMLButtonElement;
	const cVcBtn = document.querySelector('#computerVsComputer') as HTMLButtonElement;

	const startBtn = document.querySelector('#start') as HTMLButtonElement;
	const randomBtn = document.querySelector('#randomPlacement') as HTMLButtonElement;

	const allBtns = [pVcBtn, newGameBtn, cVcBtn, startBtn, randomBtn];

	const speeds = document.getElementsByName('speed');
	let speedValue = 1000;

	const muteBtn = document.querySelector('#mute');
	let isMuted = false;

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

	const getBoardId = (gameboard: Gameboard) => {
		if (gameboard === controller.humanGameboard) {
			return 'firstBoard';
		} else if (gameboard === controller.computerGameboard) {
			return 'secondBoard';
		}
	};

	const renderBoard = (gameboard: Gameboard) => {
		const board = document.createElement('div');
		board.classList.add('board');
		board.id = getBoardId(gameboard);
		renderCells(gameboard, board);
		boards.append(board);
	};

	const clearShip = (ship: Ship, gameboard: Gameboard) => {
		const cells = document.querySelectorAll(`#${getBoardId(gameboard)} .cell`);
		cells.forEach((cell) => {
			if (cell.classList.contains('taken') && cell.getAttribute('data-shipName') === ship.name.toLowerCase()) {
				cell.classList.remove('taken');
				cell.classList.add('empty');
				cell.removeAttribute('data-shipName');
			}
		});
	};

	const refreshBoard = (gameboard: Gameboard) => {
		const board = document.querySelector(`#${getBoardId(gameboard)}`);
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
		fillCells('first');

		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));

		await new Promise((resolve) => setTimeout(resolve, getSpeedValue()));

		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);

		canBeStarted();
		setInitMessage();
	};

	const handleNewGame = async () => {
		setRestartMessage();

		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));

		await controller.newGame();

		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);

		canBeStarted();

		if (pVcBtn.classList.contains('selected')) {
			setInitMessage();
		}
	};

	const handleCvC = async () => {
		waiting(true);
		allBtns.forEach((btn) => (btn.disabled = true));

		await new Promise((resolve) => setTimeout(resolve, getSpeedValue()));

		allBtns.forEach((btn) => (btn.disabled = false));
		waiting(false);

		startBtn.disabled = true;
		randomBtn.disabled = true;
		cVcBtn.disabled = true;
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
			setRestartMessage();
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

	const createShipElement = (firstCell: Cell) => {
		const shipElement = document.createElement('div');
		const shipName = firstCell.takenBy.name.toLowerCase();
		const shipSize = firstCell.takenBy.size;

		shipElement.classList.add('ship', shipName, 'draggable');
		shipElement.setAttribute('data-size', `${shipSize}`);
		shipElement.setAttribute('data-name', `${shipName}`);
		shipElement.setAttribute('draggable', 'true');

		return shipElement;
	};

	const setShipStyle = (shipElement: HTMLElement, shipSize: number, cellSize: number, isVertical: boolean) => {
		const htmlElement = document.querySelector('html');
		const rootFontSize = parseFloat(window.getComputedStyle(htmlElement, null).getPropertyValue('font-size'));

		if (!isVertical) {
			shipElement.style.width = shipSize * (cellSize / rootFontSize) + 'rem';
			shipElement.style.height = cellSize / rootFontSize + 'rem';
		} else {
			shipElement.style.width = cellSize / rootFontSize + 'rem';
			shipElement.style.height = shipSize * (cellSize / rootFontSize) + 'rem';
		}
	};

	const resizeHandler = (shipElement: HTMLElement, shipSize: number, isVertical: boolean) => {
		const cellSize = (document.querySelector('.board .cell') as HTMLElement).getBoundingClientRect().width;
		setShipStyle(shipElement, shipSize, cellSize, isVertical);
	};

	const createShipOverlay = (gameboard: Gameboard) => {
		gameboard.shipsPlaced.forEach((firstCell) => {
			const shipElement = createShipElement(firstCell);
			const cellSize = (document.querySelector('.board .cell') as HTMLElement).getBoundingClientRect().width;
			const shipSize = firstCell.takenBy.size;
			const isVertical = firstCell.takenBy.isVertical;

			const firstCellElement = document.querySelector(`#${getBoardId(gameboard)} .cell[data-col="${firstCell.col}"][data-row="${firstCell.row}"]`);
			firstCellElement.appendChild(shipElement);

			setShipStyle(shipElement, shipSize, cellSize, isVertical);
			window.addEventListener('resize', () => resizeHandler(shipElement, shipSize, isVertical));
		});
	};

	const canBeStarted = () => {
		if (controller.humanGameboard.shipsPlaced.length === 5 && controller.computerGameboard.shipsPlaced.length === 0) {
			fillCells('second');
			startBtn.disabled = false;
			return true;
		} else {
			startBtn.disabled = true;
			return false;
		}
	};

	const setInitMessage = () => {
		const statusTextMobile = "Use 'Random Placement' button, then press Start!";
		const statusTextDesktop = "Drag and drop ships onto the left board or use 'Random Placement' button. Right click to rotate. When ready, press Start!";

		if (
			statusBox.textContent === statusTextMobile ||
			statusBox.textContent === statusTextDesktop ||
			statusBox.textContent === 'Restarting...' ||
			statusBox.textContent === 'You can now begin the game. Press start!'
		) {
			statusBox.textContent = statusTextMobile;

			if (window.matchMedia('(min-width: 1024px)').matches) {
				statusBox.textContent = statusTextDesktop;
			}
		}
	};

	const setStartMessage = () => {
		if (canBeStarted()) {
			statusBox.textContent = 'You can now begin the game. Press start!';
		}
	};

	const setTurnMessagePvC = (isPlayerTurn: boolean) => {
		if (isPlayerTurn) {
			statusBox.textContent = "Player's turn. Take aim and attack!";
		} else {
			statusBox.textContent = "Computer's turn. The shot is coming!";
		}
	};

	const setTurnMessageCvC = (isPlayerTurn: boolean) => {
		if (isPlayerTurn) {
			statusBox.textContent = "Violet's turn";
		} else {
			statusBox.textContent = "Blue's turn";
		}
	};

	const setGameOverMessagePvC = (who: string) => {
		if (who === 'player') {
			statusBox.textContent = 'Game over, Player wins!';
		} else if (who === 'computer') {
			statusBox.textContent = 'Game over, Computer wins!';
		}
	};

	const setGameOverMessageCvC = (who: string) => {
		if (who === 'player') {
			statusBox.textContent = 'Game over, Blue Computer wins!';
		} else if (who === 'computer') {
			statusBox.textContent = 'Game over, Violet Computer wins!';
		}
	};

	const setRestartMessage = () => {
		statusBox.textContent = 'Restarting...';
	};

	const fillCells = (input: string) => {
		let board;

		if (input === 'first') {
			board = document.querySelector('#firstBoard');
		} else if (input === 'second') {
			board = document.querySelector('#secondBoard');
		}

		const cells = board.querySelectorAll('.cell');

		cells.forEach((cell) => {
			cell.classList.add('filled');
		});
	};

	const unFillCells = async (input: string) => {
		waiting(true);

		let board;

		if (input === 'first') {
			board = document.querySelector('#firstBoard');
		} else if (input === 'second') {
			board = document.querySelector('#secondBoard');
		}

		const cells = board.querySelectorAll('.cell');

		cells.forEach((cell) => {
			cell.classList.add('filled');
		});

		await new Promise<void>((resolve) => {
			cells.forEach((cell, index) => {
				setTimeout(() => {
					cell.classList.remove('filled');
					if (index === cells.length - 1) {
						resolve();
					}

					if ((index + 1) % 6 === 0) {
						sounds.tick.play();
					}
				}, (getSpeedValue() / 120) * index);
			});
		});
		waiting(false);
	};

	const toggleMute = () => {
		const speakerIcon = document.querySelector('#speaker');

		if (!isMuted) {
			muteBtn.classList.add('muted');
			speakerIcon.classList.remove('fa-volume-high');
			speakerIcon.classList.add('fa-volume-xmark');

			for (let sound of Object.values(sounds)) {
				sound.volume = 0;
			}
		} else {
			muteBtn.classList.remove('muted');
			speakerIcon.classList.remove('fa-volume-xmark');
			speakerIcon.classList.add('fa-volume-high');

			for (let sound of Object.values(sounds)) {
				sound.volume = 1;
			}
		}

		isMuted = !isMuted;
		sounds.select.play();
	};

	pVcBtn.addEventListener('click', () => {
		fillCells('first');

		handleGameMode(pVcBtn, cVcBtn);

		const second = document.querySelector('#secondBoard');
		second.classList.remove('start');

		startBtn.disabled = true;
		pVcBtn.disabled = true;

		sounds.select.play();

		unFillCells('first');
	});

	cVcBtn.addEventListener('click', () => {
		fillCells('first');
		fillCells('second');

		handleGameMode(cVcBtn, pVcBtn);

		const second = document.querySelector('#secondBoard');
		second.classList.remove('hide');
		second.classList.add('start');

		startBtn.disabled = true;
		randomBtn.disabled = true;
		cVcBtn.disabled = true;

		sounds.select.play();

		Promise.all([unFillCells('first'), unFillCells('second')]);
	});

	newGameBtn.addEventListener('click', async () => {
		removeBoardPointer();
		fillCells('first');

		if (cVcBtn.classList.contains('selected')) {
			fillCells('second');

			startBtn.disabled = true;
			randomBtn.disabled = true;
			cVcBtn.disabled = true;
		}

		sounds.select.play();

		await handleNewGame();

		const second = document.querySelector('#secondBoard');
		second.classList.remove('hide');

		if (pVcBtn.classList.contains('selected')) {
			second.classList.remove('start');

			unFillCells('first');

			startBtn.disabled = true;
			pVcBtn.disabled = true;
		}

		if (cVcBtn.classList.contains('selected')) {
			second.classList.add('start');
			randomBtn.disabled = true;

			Promise.all([unFillCells('first'), unFillCells('second')]);

			startBtn.disabled = true;
			randomBtn.disabled = true;
			cVcBtn.disabled = true;
		}
	});

	startBtn.addEventListener('click', () => {
		controller.start();

		const second = document.querySelector('#secondBoard');
		second.classList.add('hide');
		second.classList.add('start');

		startBtn.disabled = true;
		randomBtn.disabled = true;

		unFillCells('second');
	});

	randomBtn.addEventListener('click', () => {
		controller.computerGameboard.clearBoard();
		refreshBoard(controller.computerGameboard);
		controller.randomizeShipsPlacement(controller.humanGameboard);
		dragAndDrop(controller.humanGameboard, controller.computerGameboard, controller.humanShips);
		canBeStarted();
		setStartMessage();
		fillCells('second');

		sounds.random.play();
	});

	const setSpeedValue = (event: Event) => {
		let input = event.target as HTMLInputElement;
		if (input.checked) {
			speedValue = Number(input.value);
		}
	};

	const getSpeedValue = () => speedValue;

	speeds.forEach((speedBtn) => {
		speedBtn.addEventListener('click', (e) => {
			setSpeedValue(e);
			sounds.select.play();
		});
	});

	muteBtn.addEventListener('click', toggleMute);
	window.addEventListener('resize', setInitMessage);

	return {
		renderBoard,
		clearShip,
		refreshBoard,
		handleUserInput,
		pVcBtn,
		cVcBtn,
		waiting,
		setBoardPointer,
		removeBoardPointer,
		createShipOverlay,
		canBeStarted,
		setInitMessage,
		setStartMessage,
		setTurnMessagePvC,
		setTurnMessageCvC,
		setGameOverMessagePvC,
		setGameOverMessageCvC,
		setRestartMessage,
		getSpeedValue,
		fillCells,
		unFillCells,
	};
})();

export default ui;
