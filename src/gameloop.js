import Computer from "./Computer";
import {
  addEventListenerToSquares,
  attackComputerSquare,
  attackMe,
  attackSquares,
  currentCoordinates,
  displayComputerHits,
  displaySunkShips,
  generateComputerGrid,
  generatePlayerGrid,
  getCoordinatesToPlaceShip,
  removeEventListeners,
  waitForClick,
} from "./DOM-interaction";

import Gameboard from "./Gameboard";
import Player from "./Player";
import ShipFactory from "./Ship";
import { repeat, waitTilTrue } from "./utils";
let activeClass = "attacker";
let currentShipLength = 3;
let direction = "horizontal";

const gameSetup = async (player) => {
  const playerOne = player;
  playerOne.gameboard = Gameboard(playerOne.name);

  generatePlayerGrid();
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "bombarder";
  currentShipLength = 3;
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "submarine";
  currentShipLength = 4;
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "navy-ship";
  currentShipLength = 2;
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
  removeEventListeners();
  console.log(playerOne.gameboard);
  const computer = Computer();
  computer.gameboard = Gameboard(computer.name);
  generateComputerGrid();
  activeClass = "attacker";
  currentShipLength = 3;
  computer.placeShipRandomly(
    ShipFactory(currentShipLength, activeClass),
    computer.gameboard
  );
  activeClass = "bombarder";
  currentShipLength = 3;

  computer.placeShipRandomly(
    ShipFactory(currentShipLength, activeClass),
    computer.gameboard
  );
  activeClass = "submarine";
  currentShipLength = 4;

  computer.placeShipRandomly(
    ShipFactory(currentShipLength, activeClass),
    computer.gameboard
  );
  activeClass = "navy-ship";
  currentShipLength = 2;

  computer.placeShipRandomly(
    ShipFactory(currentShipLength, activeClass),
    computer.gameboard
  );
  gameLoop(playerOne, computer);
};

const gameLoop = async (player, computer) => {
  while (
    player.gameboard.allShipsSunk() == false &&
    computer.gameboard.allShipsSunk() == false
  ) {
    const targetSquare = await attackComputerSquare();
    computer.gameboard.receiveAttack(targetSquare);
    displaySunkShips(computer.gameboard.sunkShips);
    computer.makeMove(player.gameboard);
    displayComputerHits(player.gameboard);

    continue;
  }
};

export { gameSetup, activeClass, currentShipLength, direction };
