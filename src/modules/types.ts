export type Cell = {
	col: string;
	row: string;
	status?: string;
	takenBy?: Ship;
	result?: string;
};

export type Ship = {
	name: string;
	size: number;
	hit: () => void;
	isSunk: () => boolean;
};

export type Gameboard = {
	getCell: (col: string, row: string) => Cell;
	setCell: (col: string, row: string, status: string, takenBy?: Ship) => Cell;
	placeShip: (ship: Ship, col: string, row: string, orientation: string) => boolean;
	receiveAttack: (col: string, row: string) => string;
	sinkShip: (gameboard: Gameboard, col: string, row: string) => void;
	allSunk: () => boolean;
	array: Cell[][];
};

export type Player = {
	attack: (gameboard: Gameboard, col: string, row: string) => string;
	randomAttack: (gameboard: Gameboard) => Cell;
};
