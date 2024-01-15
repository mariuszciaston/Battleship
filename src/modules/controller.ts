import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';
import ui from './ui';
import { Gameboard } from './types';

const controller = (() => {
	const humanGameboard = gameboardFactory();
	const computerGameboard = gameboardFactory();

	const human = playerFactory();
	const computer = playerFactory();

	let isStopped = false;

	const populateGameboard = () => {
		const humanCarrier = shipFactory('Carrier');
		const humanBattleship = shipFactory('Battleship');
		const humanDestroyer = shipFactory('Destroyer');
		const humanSubmarine = shipFactory('Submarine');
		const humanPatrolboat = shipFactory('Patrol Boat');

		const computerCarrier = shipFactory('Carrier');
		const computerBattleship = shipFactory('Battleship');
		const computerDestroyer = shipFactory('Destroyer');
		const computerSubmarine = shipFactory('Submarine');
		const computerPatrolboat = shipFactory('Patrol Boat');

		humanGameboard.placeShip(humanCarrier, 'A', '1', 'horizontal');
		humanGameboard.placeShip(humanBattleship, 'A', '3', 'horizontal');
		humanGameboard.placeShip(humanDestroyer, 'A', '5', 'horizontal');
		humanGameboard.placeShip(humanSubmarine, 'A', '7', 'horizontal');
		humanGameboard.placeShip(humanPatrolboat, 'A', '9', 'horizontal');

		computerGameboard.placeShip(computerCarrier, 'A', '1', 'vertical');
		computerGameboard.placeShip(computerBattleship, 'C', '1', 'vertical');
		computerGameboard.placeShip(computerDestroyer, 'E', '1', 'vertical');
		computerGameboard.placeShip(computerSubmarine, 'G', '1', 'vertical');
		computerGameboard.placeShip(computerPatrolboat, 'I', '1', 'vertical');

		// humanGameboard.array.forEach((row) => {
		// 	row.forEach((cell) => {
		// 		if (cell.status === 'empty') {
		// 			computer.attack(humanGameboard, cell.col, cell.row);
		// 		}
		// 	});
		// });

		// computer.attack(humanGameboard, 'D', '1');
		// computer.attack(humanGameboard, 'E', '1');
	};

	const isGameOver = () => {
		if (computerGameboard.allSunk()) {
			console.log('All computer ships are sunk. Human player won!');
			return true;
		}

		if (humanGameboard.allSunk()) {
			console.log('All human ships are sunk. Computer player won!');
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

		console.log('start computerAI', player.getPrevHit());

		if (gameboard.hitButNotSunk(gameboard)) {
			if (
				player.getPrevHit() !== null &&
				player.getLastHit() !== null &&
				gameboard.getCell(player.getLastHit().col, player.getLastHit().row).takenBy.hitCount >= 2 &&
				gameboard.getCell(player.getLastHit().col, player.getLastHit().row).takenBy.hitCount <= 4
			) {
				console.log('FINISH: >= 2 trafienia w statek', player.getPrevHit());

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
				console.log('Cell hit, assigning new values to prevHit and lastHit');
				player.setPrevHit(player.getLastHit());
				player.setLastHit({ col, row });
				console.log('New value of prevHit:', player.getPrevHit());
			} else {
				console.log('Cell not hit, prevHit remains:', player.getPrevHit());
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
		console.log('start playerVsComputerMode', computer.getPrevHit());

		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			if (isPlayerTurn) {
				ui.waiting(false);
				const { col, row } = await ui.handleUserInput();
				human.attack(computerGameboard, col, row);
				computerGameboard.sinkShip(computerGameboard, col, row);
				ui.refreshBoard(computerGameboard);
				isPlayerTurn = false;
			}

			if (!isPlayerTurn) {
				ui.waiting(true);
				await new Promise((resolve) => setTimeout(resolve, 1000));

				if (!ui.pVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				console.log('before computerAI', computer.getPrevHit());

				computerAI(humanGameboard);
				ui.refreshBoard(humanGameboard);
				isPlayerTurn = true;
			}
		}
		isStopped = false;
	};

	const computerVsComputerMode = async () => {
		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			ui.waiting(true);
			if (isPlayerTurn) {
				await new Promise((resolve) => setTimeout(resolve, 500));

				if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				computerAI(humanGameboard);
				ui.refreshBoard(humanGameboard);
				isPlayerTurn = false;
			}

			if (!isPlayerTurn) {
				await new Promise((resolve) => setTimeout(resolve, 500));

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

	const pickGameMode = () => {
		console.log('start pickGameMode', computer.getPrevHit());

		if (ui.pVcBtn.classList.contains('selected')) {
			return playerVsComputerMode();
		} else if (ui.cVcBtn.classList.contains('selected')) {
			return computerVsComputerMode();
		}
	};

	const start = () => {
		populateGameboard();

		ui.renderBoard(humanGameboard);
		ui.renderBoard(computerGameboard);

		console.log('before pickGameMode', computer.getPrevHit());

		pickGameMode();
	};

	const restart = () => {
		computer.setPrevHit(null);
		computer.setLastHit(null);

		humanGameboard.clearBoard();
		computerGameboard.clearBoard();

		populateGameboard();
		ui.refreshBoard(humanGameboard);
		ui.refreshBoard(computerGameboard);
		pickGameMode();
	};

	const newGame = async () => {
		isStopped = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isStopped = false;
		ui.waiting(false);
		restart();
	};

	return { start, humanGameboard, computerGameboard, restart, newGame };
})();

export default controller;
