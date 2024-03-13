import { Gameboard } from './types';

import { humanGameboard, computerGameboard } from './gameboard';

import shipFactory from './ship';
import playerFactory from './player';
import ui from './ui';
import dragAndDrop from './dragAndDrop';

const controller = (() => {
	const human = playerFactory();
	const computer = playerFactory();

	let isStopped = true;

	let humanCarrier = shipFactory('Carrier');
	let humanBattleship = shipFactory('Battleship');
	let humanDestroyer = shipFactory('Destroyer');
	let humanSubmarine = shipFactory('Submarine');
	let humanPatrolboat = shipFactory('PatrolBoat');

	const humanShips = [humanCarrier, humanBattleship, humanDestroyer, humanSubmarine, humanPatrolboat];

	const populateShips = () => {
		computerGameboard.placeShip(humanCarrier, 'A', '1', 'horizontal');
		computerGameboard.placeShip(humanBattleship, 'A', '3', 'horizontal');
		computerGameboard.placeShip(humanDestroyer, 'A', '5', 'horizontal');
		computerGameboard.placeShip(humanSubmarine, 'A', '7', 'horizontal');
		computerGameboard.placeShip(humanPatrolboat, 'A', '9', 'horizontal');

		computerGameboard.reserveSpace(computerGameboard, 'A', '1');
		computerGameboard.reserveSpace(computerGameboard, 'A', '3');
		computerGameboard.reserveSpace(computerGameboard, 'A', '5');
		computerGameboard.reserveSpace(computerGameboard, 'A', '7');
		computerGameboard.reserveSpace(computerGameboard, 'A', '9');
	};

	const isGameOver = () => {
		if (computerGameboard.allSunk(computerGameboard)) {
			ui.removeBoardPointer();

			if (ui.pVcBtn.classList.contains('selected')) {
				ui.setGameOverMessagePvC('player');
			}

			if (ui.cVcBtn.classList.contains('selected')) {
				ui.setGameOverMessageCvC('player');
			}

			// console.log('All computer ships are sunk. Human player won!');
			return true;
		}

		if (humanGameboard.allSunk(humanGameboard)) {
			ui.removeBoardPointer();

			if (ui.pVcBtn.classList.contains('selected')) {
				ui.setGameOverMessagePvC('computer');
			}

			if (ui.cVcBtn.classList.contains('selected')) {
				ui.setGameOverMessageCvC('computer');
			}

			// console.log('All human ships are sunk. Computer player won!');
			return true;
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
			if (
				player.getPrevHit() !== null &&
				player.getLastHit() !== null &&
				gameboard.getCell(player.getLastHit().col, player.getLastHit().row).takenBy.hitCount >= 2 &&
				gameboard.getCell(player.getLastHit().col, player.getLastHit().row).takenBy.hitCount <= 4
			) {
				// console.log('FINISH: >= 2 trafienia w statek', player.getPrevHit());

				player.finishingAttack(gameboard, player.getLastHit().col, player.getLastHit().row, player.getPrevHit());
				gameboard.sinkShip(gameboard, player.getLastHit().col, player.getLastHit().row);

				if (isGameOver()) {
					return;
				}
			} else if (gameboard.getCell(player.getLastHit().col, player.getLastHit().row).takenBy.hitCount === 1) {
				player.followupAttack(gameboard, player.getLastHit().col, player.getLastHit().row);
				gameboard.sinkShip(gameboard, player.getLastHit().col, player.getLastHit().row);

				if (isGameOver()) {
					return;
				}
			}
		} else {
			const { col, row } = player.randomAttack(gameboard);
			if (gameboard.getCell(col, row).status === 'hit') {
				player.setPrevHit(player.getLastHit());
				player.setLastHit({ col, row });
			}

			if (gameboard.getCell(col, row).status === 'hit' && gameboard.getCell(col, row).takenBy.isSunk()) {
				gameboard.sinkShip(gameboard, col, row);

				player.setPrevHit(null);
				player.setLastHit(null);

				if (isGameOver()) {
					return;
				}
			}
		}
	};

	const playerVsComputerMode = async () => {
		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			if (isPlayerTurn) {
				ui.setTurnMessagePvC(isPlayerTurn);

				ui.setBoardPointer('player');
				ui.waiting(false);
				const { col, row } = await ui.handleUserInput();
				human.attack(computerGameboard, col, row);
				computerGameboard.sinkShip(computerGameboard, col, row);
				ui.refreshBoard(computerGameboard);
				isPlayerTurn = false;
			}

			if (isGameOver() || isStopped) {
				break;
			}

			if (!isPlayerTurn) {
				ui.setTurnMessagePvC(isPlayerTurn);

				ui.setBoardPointer('computer');
				ui.waiting(true);
				await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));

				if (!ui.pVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				computerAI(humanGameboard);
				ui.refreshBoard(humanGameboard);
				isPlayerTurn = true;
			}
		}
		isStopped = false;
		ui.waiting(false);
	};

	const computerVsComputerMode = async () => {
		ui.removeBoardPointer();

		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			ui.waiting(true);
			if (isPlayerTurn) {
				ui.setTurnMessageCvC(isPlayerTurn);

				await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));

				if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				computerAI(humanGameboard);
				ui.refreshBoard(humanGameboard);
				isPlayerTurn = false;
			}

			if (isGameOver() || isStopped) {
				break;
			}

			if (!isPlayerTurn) {
				ui.setTurnMessageCvC(isPlayerTurn);

				await new Promise((resolve) => setTimeout(resolve, ui.getSpeedValue()));

				if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				computerAI(computerGameboard);
				ui.refreshBoard(computerGameboard);
				isPlayerTurn = true;
			}
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

		controller.humanShips.length = 0;

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

			controller.humanShips.push(ship);
		});
	};

	const randomizeShipsPlacement = (gameboardName: string, gameboard: Gameboard) => {
		gameboard.clearBoard();
		randomPlacement(gameboard);
		ui.refreshBoard(gameboard);

		if (gameboardName === 'first') {
			ui.createShipOverlay('first', gameboard.shipsPlaced);
		}
	};

	const resetOrientation = () => {
		humanShips.forEach((ship) => {
			if (ship.isVertical === true) {
				ship.isVertical = false;
			}
		});
	};

	const pickGameMode = () => {
		if (ui.cVcBtn.classList.contains('selected')) {
			randomizeShipsPlacement('first', humanGameboard);
			randomizeShipsPlacement('second', computerGameboard);
			isStopped = false;
			computerVsComputerMode();
			ui.refreshBoard(humanGameboard);
		}
	};

	const start = () => {
		ui.refreshBoard(humanGameboard);

		randomizeShipsPlacement('second', computerGameboard);

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

		ui.createShipOverlay('second', computerGameboard.shipsPlaced);
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

		ui.renderBoard(humanGameboard);
		ui.renderBoard(computerGameboard);

		populateShips();
		ui.refreshBoard(computerGameboard);

		ui.createShipOverlay('second', computerGameboard.shipsPlaced);
		dragAndDrop(humanGameboard, computerGameboard, humanShips);
		ui.canBeStarted();

		pickGameMode();

		ui.unFillCells('first');
		ui.pVcBtn.disabled = true;
	};

	return { init, humanGameboard, computerGameboard, restart, newGame, start, randomizeShipsPlacement, humanShips };
})();

export default controller;
