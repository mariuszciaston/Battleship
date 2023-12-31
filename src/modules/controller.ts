import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';
import ui from './ui';

const humanGameboard = gameboardFactory();
const computerGameboard = gameboardFactory();

const human = playerFactory();
const computer = playerFactory();

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

const playerVsComputer = document.querySelector('#playerVsComputer');
const computerVsComputer = document.querySelector('#computerVsComputer');

let isStopped = false;

const playerVsComputerMode = async () => {
	while (!isGameOver() && playerVsComputer.classList.contains('selected') && !isStopped) {
		const { col, row } = await ui.handleUserInput();
		human.attack(computerGameboard, col, row);
		computerGameboard.sinkShip(computerGameboard, col, row);
		ui.refreshBoard(computerGameboard);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (!playerVsComputer.classList.contains('selected') || isStopped) {
			break;
		}

		const { col: randomCol, row: randomRow } = computer.randomAttack(humanGameboard);
		humanGameboard.sinkShip(humanGameboard, randomCol, randomRow);
		ui.refreshBoard(humanGameboard);
	}

	isStopped = false;
};

const computerVsComputerMode = async () => {
	while (!isGameOver() && computerVsComputer.classList.contains('selected') && !isStopped) {
		await new Promise((resolve) => setTimeout(resolve, 100));

		if (!computerVsComputer.classList.contains('selected') || isStopped) {
			break;
		}

		const { col: randomCol2, row: randomRow2 } = computer.randomAttack(humanGameboard);
		humanGameboard.sinkShip(humanGameboard, randomCol2, randomRow2);
		ui.refreshBoard(humanGameboard);

		await new Promise((resolve) => setTimeout(resolve, 100));

		if (!computerVsComputer.classList.contains('selected') || isStopped) {
			break;
		}

		const { col: randomCol1, row: randomRow1 } = human.randomAttack(computerGameboard);
		computerGameboard.sinkShip(computerGameboard, randomCol1, randomRow1);
		ui.refreshBoard(computerGameboard);
	}

	isStopped = false;
};

const getGameMode = () => {
	if (playerVsComputer.classList.contains('selected')) {
		return playerVsComputerMode();
	} else if (computerVsComputer.classList.contains('selected')) {
		return computerVsComputerMode();
	}
};

const start = () => {
	populateGameboard();

	ui.renderBoard(humanGameboard);
	ui.renderBoard(computerGameboard);

	getGameMode();
};

const restart = () => {
	humanGameboard.clearBoard();
	computerGameboard.clearBoard();

	populateGameboard();

	ui.refreshBoard(humanGameboard);
	ui.refreshBoard(computerGameboard);

	getGameMode();
};

const newGame = document.querySelector('#newGame') as HTMLButtonElement;
newGame.addEventListener('click', async () => {
	isStopped = true;
	newGame.disabled = true;
	newGame.textContent = 'Restarting';

	await new Promise((resolve) => setTimeout(resolve, 1000));

	restart();
	newGame.textContent = 'New Game';
	newGame.disabled = false;
});

playerVsComputer.addEventListener('click', () => {
	computerVsComputer.classList.remove('selected');

	if (!playerVsComputer.classList.contains('selected')) {
		playerVsComputer.classList.add('selected');

		restart();
	}
});

computerVsComputer.addEventListener('click', () => {
	playerVsComputer.classList.remove('selected');

	if (!computerVsComputer.classList.contains('selected')) {
		computerVsComputer.classList.add('selected');

		restart();
	}
});

export { humanGameboard, computerGameboard };
export default start;
