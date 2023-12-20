import gameboardFactory from './gameboard';
import shipFactory from './ship';
import playerFactory from './player';

const newGame = () => {
	const humanGameboard = gameboardFactory();
	const computerGameboard = gameboardFactory();

	const humanPlayer = playerFactory();
	const computerPlayer = playerFactory();

	return { humanGameboard, computerGameboard, humanPlayer, computerPlayer };
};

const populateGameboard = () => {
	const carrier = shipFactory('Carrier');
	const battleship = shipFactory('Battleship');
	const destroyer = shipFactory('Destroyer');
	const submarine = shipFactory('Submarine');
	const patrolboat = shipFactory('Patrol Boat');

	newGame.humanGameboard.placeShip(carrier, 'A', '1', 'horizontal');
	newGame.humanGameboard.placeShip(battleship, 'A', '3', 'horizontal');
	newGame.humanGameboard.placeShip(destroyer, 'A', '5', 'horizontal');
	newGame.humanGameboard.placeShip(submarine, 'A', '7', 'horizontal');
	newGame.humanGameboard.placeShip(patrolboat, 'A', '9', 'horizontal');

	newGame.computerGameboard.placeShip(carrier, 'A', '1', 'vertical');
	newGame.computerGameboard.placeShip(battleship, 'C', '1', 'vertical');
	newGame.computerGameboard.placeShip(destroyer, 'E', '1', 'vertical');
	newGame.computerGameboard.placeShip(submarine, 'G', '1', 'vertical');
	newGame.computerGameboard.placeShip(patrolboat, 'I', '1', 'vertical');
};

newGame();
populateGameboard();
