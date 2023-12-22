import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';

const humanGameboard = gameboardFactory();
const computerGameboard = gameboardFactory();

const humanPlayer = playerFactory();
const computerPlayer = playerFactory();

const populateGameboard = () => {
	const carrier = shipFactory('Carrier');
	const battleship = shipFactory('Battleship');
	const destroyer = shipFactory('Destroyer');
	const submarine = shipFactory('Submarine');
	const patrolboat = shipFactory('Patrol Boat');

	humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');
	humanGameboard.placeShip(battleship, 'A', '3', 'horizontal');
	humanGameboard.placeShip(destroyer, 'A', '5', 'horizontal');
	humanGameboard.placeShip(submarine, 'A', '7', 'horizontal');
	humanGameboard.placeShip(patrolboat, 'A', '9', 'horizontal');

	computerGameboard.placeShip(carrier, 'A', '1', 'vertical');
	computerGameboard.placeShip(battleship, 'C', '1', 'vertical');
	computerGameboard.placeShip(destroyer, 'E', '1', 'vertical');
	computerGameboard.placeShip(submarine, 'G', '1', 'vertical');
	computerGameboard.placeShip(patrolboat, 'I', '1', 'vertical');

	computerPlayer.randomAttack(humanGameboard);
	computerPlayer.randomAttack(humanGameboard);
	computerPlayer.randomAttack(humanGameboard);
	computerPlayer.randomAttack(humanGameboard);
	computerPlayer.randomAttack(humanGameboard);

	humanPlayer.randomAttack(computerGameboard);
	humanPlayer.randomAttack(computerGameboard);
	humanPlayer.randomAttack(computerGameboard);
	humanPlayer.randomAttack(computerGameboard);
	humanPlayer.randomAttack(computerGameboard);
};

populateGameboard();

export { populateGameboard, humanGameboard, computerGameboard };
