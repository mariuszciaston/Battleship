import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';
import ui from './ui';
import { Gameboard } from './types';

const controller = (() => {
	const humanGameboard = gameboardFactory();
	const computerGameboard = gameboardFactory();

	const tempBoard = gameboardFactory();

	const human = playerFactory();
	const computer = playerFactory();

	let isStopped = true;

	let humanCarrier = shipFactory('Carrier');
	let humanBattleship = shipFactory('Battleship');
	let humanDestroyer = shipFactory('Destroyer');
	let humanSubmarine = shipFactory('Submarine');
	let humanPatrolboat = shipFactory('PatrolBoat');

	const humanShips = [humanCarrier, humanBattleship, humanDestroyer, humanSubmarine, humanPatrolboat];

	const populateTempBoard = () => {
		tempBoard.placeShip(humanCarrier, 'A', '1', 'horizontal');
		tempBoard.placeShip(humanBattleship, 'A', '3', 'horizontal');
		tempBoard.placeShip(humanDestroyer, 'A', '5', 'horizontal');
		tempBoard.placeShip(humanSubmarine, 'A', '7', 'horizontal');
		tempBoard.placeShip(humanPatrolboat, 'A', '9', 'vertical');
	};

	const isGameOver = () => {
		if (computerGameboard.allSunk(computerGameboard)) {
			// console.log('All computer ships are sunk. Human player won!');
			ui.removeBoardPointer();
			return true;
		}

		if (humanGameboard.allSunk(humanGameboard)) {
			ui.removeBoardPointer();
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
				ui.setBoardPointer('computer');
				ui.waiting(true);
				await new Promise((resolve) => setTimeout(resolve, 1000));

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
				await new Promise((resolve) => setTimeout(resolve, 1000));

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
				await new Promise((resolve) => setTimeout(resolve, 1000));

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

	const rotateShip = () => {
		console.log('rotate');
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

				// gameboard.reserveSpace(gameboard, col, row);
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

	const start = () => {
		// should wait here for humanGameboard to be ready before starting. All Ships should be placed
		randomizeShipsPlacement('second', computerGameboard);
		isStopped = false;
		playerVsComputerMode();
	};

	const pickGameMode = () => {
		if (ui.cVcBtn.classList.contains('selected')) {
			randomizeShipsPlacement('first', humanGameboard);
			randomizeShipsPlacement('second', computerGameboard);
			isStopped = false;
			computerVsComputerMode();
		}
	};

	const restart = () => {
		isStopped = true;

		human.setPrevHit(null);
		human.setLastHit(null);

		computer.setPrevHit(null);
		computer.setLastHit(null);

		humanGameboard.clearBoard();
		computerGameboard.clearBoard();

		ui.refreshBoard(humanGameboard);
		ui.refreshBoard(computerGameboard);

		pickGameMode();
	};

	const newGame = async () => {
		isStopped = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isStopped = false;
		restart();
	};

	const init = () => {
		ui.renderBoard(humanGameboard);
		// ui.renderBoard(computerGameboard);
		ui.renderBoard(tempBoard);

		populateTempBoard();
		ui.refreshBoard(tempBoard);

		ui.createShipOverlay('temp', tempBoard.shipsPlaced);
		ui.dragAndDrop(humanGameboard, tempBoard, humanShips);

		pickGameMode();
	};

	return { init, humanGameboard, computerGameboard, tempBoard, restart, newGame, rotateShip, start, randomizeShipsPlacement, humanShips };
})();

export default controller;
