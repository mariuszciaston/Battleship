export type Cell = {
	col: string;
	row: string;
	status: string;
	takenBy: Ship;
};

export type Ship = {
	name: string;
	size: number;
	hit: () => void;
	isSunk: () => boolean;
};

export type Gameboard = {
	getCell: (col: string, row: string) => Cell;
	placeShip: (ship: Ship, col: string, row: string, orientation: string) => boolean;
	receiveAttack: (col: string, row: string) => string;
	allSunk: () => boolean;
	array: Cell[][];
};

export type Player = {
	attack: (col: string, row: string, gameboard: Gameboard) => string;
	randomAttack: (gameboard: Gameboard) => string;
};
