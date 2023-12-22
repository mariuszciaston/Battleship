import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';

const humanGameboard = gameboardFactory();
const computerGameboard = gameboardFactory();

const human = playerFactory();
const computer = playerFactory();

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

	computer.randomAttack(humanGameboard);
	computer.randomAttack(humanGameboard);
	computer.randomAttack(humanGameboard);
	computer.randomAttack(humanGameboard);
	computer.randomAttack(humanGameboard);

	human.randomAttack(computerGameboard);
	human.randomAttack(computerGameboard);
	human.randomAttack(computerGameboard);
	human.randomAttack(computerGameboard);
	human.randomAttack(computerGameboard);




};

populateGameboard();

export { populateGameboard, humanGameboard, computerGameboard };
