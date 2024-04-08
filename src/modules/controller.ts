import { Gameboard, Ship } from './types';
import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';
import ui from './ui';
import dragAndDrop from './dragAndDrop';
import sounds from './sounds';

const controller = (() => {
	const humanGameboard = gameboardFactory();
	const computerGameboard = gameboardFactory();

	const human = playerFactory();
	const computer = playerFactory();

	let isStopped = true;

	let humanCarrier: Ship;
	let humanBattleship: Ship;
	let humanDestroyer: Ship;
	let humanSubmarine: Ship;
	let humanPatrolboat: Ship;

	let humanShips = [humanCarrier, humanBattleship, humanDestroyer, humanSubmarine, humanPatrolboat];

	const populateShips = () => {
		humanCarrier = shipFactory('Carrier');
		humanBattleship = shipFactory('Battleship');
		humanDestroyer = shipFactory('Destroyer');
		humanSubmarine = shipFactory('Submarine');
		humanPatrolboat = shipFactory('PatrolBoat');

		humanShips = [humanCarrier, humanBattleship, humanDestroyer, humanSubmarine, humanPatrolboat];

		computerGameboard.placeShip(humanCarrier, 'A', '1', 'horizontal');
		computerGameboard.placeShip(humanBattleship, 'A', '3', 'horizontal');
		computerGameboard.placeShip(humanDestroyer, 'A', '5', 'horizontal');
		computerGameboard.placeShip(humanSubmarine, 'A', '7', 'horizontal');
		computerGameboard.placeShip(humanPatrolboat, 'A', '9', 'horizontal');

		computerGameboard.reserveSpaceForAll(computerGameboard);
	};

	const renew = () => {
		ui.refreshBoard(humanGameboard);
		ui.refreshBoard(computerGameboard);
		ui.createShipOverlay(humanGameboard);
		ui.createShipOverlay(computerGameboard);
		dragAndDrop(humanGameboard, computerGameboard, humanShips);
	};

	const handleGameOver = (winner: string) => {
		ui.removeBoardPointer();

		if (ui.pVcBtn.classList.contains('selected')) {
			ui.setGameOverMessagePvC(winner);
		}

		if (ui.cVcBtn.classList.contains('selected')) {
			ui.setGameOverMessageCvC(winner);
		}

		sounds.gameOver.play();

		return true;
	};

	const isGameOver = () => {
		if (computerGameboard.allSunk(computerGameboard)) {
			return handleGameOver('player');
		}

		if (humanGameboard.allSunk(humanGameboard)) {
			return handleGameOver('computer');
		}

		return false;
	};

	const computerAI = (gameboard: Gameboard) => {
		let player;

		if (gameboard === humanGameboard) {
			player = computer;
		} else if (gameboard === computerGameboard) {
			player = human;
		}

		if (gameboard.hitButNotSunk(gameboard)) {
			const lastHit = player.getLastHit();
			const prevHit = player.getPrevHit();
			const cell = gameboard.getCell(lastHit.col, lastHit.row);
			const hitCount = cell.takenBy.hitCount;

			if (prevHit !== null && lastHit !== null && hitCount >= 2 && hitCount <= 4) {
				player.finishingAttack(gameboard, lastHit.col, lastHit.row, prevHit);
			} else if (hitCount === 1) {
				player.followupAttack(gameboard, lastHit.col, lastHit.row);
			}

			if (gameboard.canBeSunk(cell)) {
				gameboard.sinkShip(gameboard, lastHit.col, lastHit.row);
				sounds.sunk.play();
			}

			if (isGameOver()) {
				return;
			}
		} else {
			const { col, row } = player.randomAttack(gameboard);
			const cell = gameboard.getCell(col, row);

			if (cell.status === 'hit') {
				player.setPrevHit(player.getLastHit());
				player.setLastHit({ col, row });

				if (gameboard.canBeSunk(cell)) {
					gameboard.sinkShip(gameboard, col, row);
					sounds.sunk.play();

					player.setPrevHit(null);
					player.setLastHit(null);

					if (isGameOver()) {
						return;
					}
				}
			}
		}
	};

	const playerTurn = async () => {
		ui.setTurnMessagePvC(true);
		ui.setBoardPointer('player');
		ui.waiting(false);
		const { col, row } = await ui.handleUserInput();
		human.attack(computerGameboard, col, row);

		const cell = computerGameboard.getCell(col, row);
		if (computerGameboard.canBeSunk(cell)) {
			computerGameboard.sinkShip(computerGameboard, col, row);
			sounds.sunk.play();
		}

		ui.refreshBoard(computerGameboard);
	};

	const computerTurn = async () => {
		ui.setTurnMessagePvC(false);
		ui.setBoardPointer('computer');
		ui.waiting(true);
		await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));
		if (!ui.pVcBtn.classList.contains('selected') || isStopped) {
			return;
		}
		computerAI(humanGameboard);
		ui.refreshBoard(humanGameboard);
	};

	const playerVsComputerMode = async () => {
		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			if (isPlayerTurn) {
				await playerTurn();
				isPlayerTurn = false;
			}

			if (isGameOver() || isStopped) {
				break;
			}

			if (!isPlayerTurn) {
				await computerTurn();
				isPlayerTurn = true;
			}
		}
		isStopped = false;
		ui.waiting(false);
	};

	const cpuTurn = async (isPlayerTurn: boolean, gameboard: Gameboard) => {
		ui.waiting(true);
		ui.setTurnMessageCvC(isPlayerTurn);

		await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));

		if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
			return;
		}

		computerAI(gameboard);
		ui.refreshBoard(gameboard);
	};

	const computerVsComputerMode = async () => {
		ui.removeBoardPointer();

		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			await cpuTurn(isPlayerTurn, isPlayerTurn ? humanGameboard : computerGameboard);
			isPlayerTurn = !isPlayerTurn;
		}

		isStopped = false;
		ui.waiting(false);
	};

	const randomPlacement = (gameboard: Gameboard) => {
		let allShips;

		if (gameboard === humanGameboard) {
			humanCarrier = shipFactory('Carrier');
			humanBattleship = shipFactory('Battleship');
			humanDestroyer = shipFactory('Destroyer');
			humanSubmarine = shipFactory('Submarine');
			humanPatrolboat = shipFactory('PatrolBoat');

			allShips = [humanCarrier, humanBattleship, humanDestroyer, humanSubmarine, humanPatrolboat];
		} else if (gameboard === computerGameboard) {
			const computerCarrier = shipFactory('Carrier');
			const computerBattleship = shipFactory('Battleship');
			const computerDestroyer = shipFactory('Destroyer');
			const computerSubmarine = shipFactory('Submarine');
			const computerPatrolboat = shipFactory('PatrolBoat');

			allShips = [computerCarrier, computerBattleship, computerDestroyer, computerSubmarine, computerPatrolboat];
		}

		humanShips.length = 0;

		const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

		const randomCol = () => cols[Math.floor(Math.random() * cols.length)];
		const randomRow = () => Math.ceil(Math.random() * 10).toString();
		const randomOrientation = () => (Math.random() > 0.5 ? 'horizontal' : 'vertical');

		allShips.forEach((ship) => {
			let col = randomCol();
			let row = randomRow();
			let orientation = randomOrientation();

			let result = gameboard.canBePlaced(ship.size, col, row, orientation);

			while (!result) {
				col = randomCol();
				row = randomRow();
				orientation = randomOrientation();

				result = gameboard.canBePlaced(ship.size, col, row, orientation);
			}

			if (result) {
				gameboard.placeShip(ship, col, row, orientation);
				gameboard.reserveSpace(gameboard, col, row);
			}

			humanShips.push(ship);
		});
	};

	const randomizeShipsPlacement = (gameboard: Gameboard) => {
		gameboard.clearBoard();
		randomPlacement(gameboard);
		ui.refreshBoard(gameboard);

		if (gameboard === humanGameboard) {
			ui.createShipOverlay(gameboard);
		}
	};

	const resetOrientation = () => {
		humanShips.forEach((ship) => {
			ship.isVertical = false;
		});
	};

	const pickGameMode = () => {
		if (ui.cVcBtn.classList.contains('selected')) {
			randomizeShipsPlacement(humanGameboard);
			randomizeShipsPlacement(computerGameboard);
			isStopped = false;
			computerVsComputerMode();
			ui.refreshBoard(humanGameboard);
		}
	};

	const start = () => {
		ui.refreshBoard(humanGameboard);
		randomizeShipsPlacement(computerGameboard);
		isStopped = false;
		playerVsComputerMode();
	};

	const restart = () => {
		isStopped = true;

		human.setPrevHit(null);
		human.setLastHit(null);

		computer.setPrevHit(null);
		computer.setLastHit(null);

		humanGameboard.clearBoard();
		computerGameboard.clearBoard();

		populateShips();

		ui.refreshBoard(humanGameboard);
		ui.refreshBoard(computerGameboard);

		ui.createShipOverlay(computerGameboard);
		dragAndDrop(humanGameboard, computerGameboard, humanShips);
		ui.canBeStarted();

		pickGameMode();
		resetOrientation();
	};

	const newGame = async () => {
		isStopped = true;
		await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));
		isStopped = false;
		restart();
	};

	const init = () => {
		ui.setInitMessage();

		humanGameboard.generateArray();
		computerGameboard.generateArray();

		ui.renderBoard(humanGameboard);
		ui.renderBoard(computerGameboard);

		populateShips();
		ui.refreshBoard(computerGameboard);

		ui.createShipOverlay(computerGameboard);
		dragAndDrop(humanGameboard, computerGameboard, humanShips);
		ui.canBeStarted();

		pickGameMode();

		ui.pVcBtn.disabled = true;
	};

	return { init, renew, humanGameboard, computerGameboard, restart, newGame, start, randomizeShipsPlacement, humanShips };
})();

export default controller;
