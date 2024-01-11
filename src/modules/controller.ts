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

	const populateGameboard = () => {
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

	const hitButNotSunk = (gameboard: Gameboard): boolean => {
		const gameboardCells = gameboard.array.flat();

		return gameboardCells.some((cell) => {
			if (cell.status === 'hit' && cell.takenBy.isSunk() === false) {
				return true;
			}
			return false;
		});
	};

	const computerAI = (gameboard: Gameboard) => {
		console.log('start computerAI', computer.getPrevHit());

		if (hitButNotSunk(gameboard)) {
			if (
				computer.getPrevHit() !== null &&
				computer.getLastHit() !== null &&
				gameboard.getCell(computer.getLastHit().col, computer.getLastHit().row).takenBy.hitCount >= 2 &&
				gameboard.getCell(computer.getLastHit().col, computer.getLastHit().row).takenBy.hitCount <= 4
			) {
				console.log('FINISH: >= 2 trafienia w statek', computer.getPrevHit());

				computer.finishingAttack(gameboard, computer.getLastHit().col, computer.getLastHit().row, computer.getPrevHit());

				gameboard.sinkShip(gameboard, computer.getLastHit().col, computer.getLastHit().row);
			} else if (gameboard.getCell(computer.getLastHit().col, computer.getLastHit().row).takenBy.hitCount === 1) {
				computer.followupAttack(gameboard, computer.getLastHit().col, computer.getLastHit().row);
				gameboard.sinkShip(gameboard, computer.getLastHit().col, computer.getLastHit().row);
			}
		} else {
			const { col, row } = computer.randomAttack(gameboard);
			if (gameboard.getCell(col, row).status === 'hit') {
				console.log('Cell hit, assigning new values to prevHit and lastHit');
				computer.setPrevHit(computer.getLastHit());
				computer.setLastHit({ col, row });
				console.log('New value of prevHit:', computer.getPrevHit());
			} else {
				console.log('Cell not hit, prevHit remains:', computer.getPrevHit());
			}

			if (gameboard.getCell(col, row).status === 'hit' && gameboard.getCell(col, row).takenBy.isSunk()) {
				gameboard.sinkShip(gameboard, col, row);

				computer.setPrevHit(null);
				computer.setLastHit(null);

				if (isGameOver()) {
					console.log('koniec');
				}
			}
		}
	};

	const playerVsComputerMode = async () => {
		console.log('start playerVsComputerMode', computer.getPrevHit());

		let isPlayerTurn = true;

		while (!isGameOver() && !isStopped) {
			if (isPlayerTurn) {
				const { col, row } = await ui.handleUserInput();
				human.attack(computerGameboard, col, row);
				computerGameboard.sinkShip(computerGameboard, col, row);
				ui.refreshBoard(computerGameboard);
				isPlayerTurn = false;
			}

			if (!isPlayerTurn) {
				await new Promise((resolve) => setTimeout(resolve, 100));

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
			if (isPlayerTurn) {
				await new Promise((resolve) => setTimeout(resolve, 500));

				if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				const { col: randomCol2, row: randomRow2 } = computer.randomAttack(humanGameboard);
				humanGameboard.sinkShip(humanGameboard, randomCol2, randomRow2);
				ui.refreshBoard(humanGameboard);
				isPlayerTurn = false;
			}

			if (!isPlayerTurn) {
				await new Promise((resolve) => setTimeout(resolve, 500));

				if (!ui.cVcBtn.classList.contains('selected') || isStopped) {
					break;
				}

				const { col: randomCol1, row: randomRow1 } = human.randomAttack(computerGameboard);
				computerGameboard.sinkShip(computerGameboard, randomCol1, randomRow1);
				ui.refreshBoard(computerGameboard);
				isPlayerTurn = true;
			}
		}
		isStopped = false;
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
		restart();
	};

	return { start, humanGameboard, computerGameboard, newGame, restart };
})();

export default controller;
