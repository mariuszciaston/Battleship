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
	hitCount: number;
	isVertical: boolean;
	rotate: () => void;
	hit: () => void;
	isSunk: () => boolean;
};

export type Gameboard = {
	array: Cell[][];
	generateArray: () => void;
	clearBoard: () => void;
	getCell: (col: string, row: string) => Cell;
	setCell: (col: string, row: string, status: string, takenBy?: Ship) => Cell;
	removeShip: (ship: Ship, gameboard: Gameboard) => void;
	placeShip: (ship: Ship, col: string, row: string, orientation: string) => boolean;
	canBePlaced: (size: number, col: string, row: string, orientation: string) => boolean;
	receiveAttack: (col: string, row: string) => string;
	receiveAround: (col: string, row: string) => string;
	reserveSpace: (gameboard: Gameboard, col: string, row: string) => void;
	reserveSpaceForAll: (gameboard: Gameboard) => void;
	removeReservedSpace: (gameboard: Gameboard) => void;
	canBeSunk: (cell: Cell) => boolean;
	sinkShip: (gameboard: Gameboard, col: string, row: string) => void;
	hitButNotSunk: (gameboard: Gameboard) => boolean;
	allSunk: (gameboard: Gameboard) => boolean;
	shipsPlaced: Cell[];
};

export type Player = {
	attack: (gameboard: Gameboard, col: string, row: string) => string;
	randomAttack: (gameboard: Gameboard) => Cell;
	followupAttack: (gameboard: Gameboard, col: string, row: string) => void;
	finishingAttack: (gameboard: Gameboard, col: string, row: string, prevHit: Cell) => void;

	prevHit: Cell;
	lastHit: Cell;

	getPrevHit: () => Cell;
	getLastHit: () => Cell;
	setPrevHit: (newPrevHit: Cell) => void;
	setLastHit: (newLastHit: Cell) => void;
};
