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

const start = async () => {
	populateGameboard();

	ui.renderBoard(humanGameboard);
	ui.renderBoard(computerGameboard);

	while (isGameOver() === false) {
		const { col, row } = await ui.handleUserInput();

		human.attack(computerGameboard, col, row);
		ui.refreshBoard(computerGameboard);

		console.log(col, row);

		await new Promise((resolve) => setTimeout(resolve, 1000));
		computer.randomAttack(humanGameboard);
		ui.refreshBoard(humanGameboard);
	}

	console.log('Game Over');
};

export { humanGameboard, computerGameboard };


export default start;
