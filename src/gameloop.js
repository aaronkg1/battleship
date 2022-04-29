import Computer from "./Computer";
import {
  attackComputerSquare,
  currentCoordinates,
  displayComputerHits,
  displaySunkShips,
  displayWinner,
  generateComputerGrid,
  generatePlayerGrid,
  removeEventListeners,
  waitForClick,
} from "./DOM-interaction";

import Gameboard from "./Gameboard";
import Player from "./Player";
import ShipFactory from "./Ship";
import { repeat, waitTilTrue } from "./utils";
let activeClass = "submarine";
let currentShipLength = 4;
let direction = "vertical";

const gameSetup = async (playerOne) => {
  playerOne.gameboard = Gameboard(playerOne.name);
  generatePlayerGrid();
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "attacker";
  currentShipLength = 3;
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
  removeEventListeners();
  activeClass = "navy-ship";
  currentShipLength = 3;
  await waitForClick();
  playerOne.gameboard.placeShip(
    currentCoordinates,
    ShipFactory(currentShipLength, activeClass)
  );
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
  currentShipLength = 3;

  computer.placeShipRandomly(
    ShipFactory(currentShipLength, activeClass),
    computer.gameboard
  );
  gameLoop(playerOne, computer);
};

const gameLoop = async (player, computer) => {
  console.log(player.gameboard);
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
  if (player.gameboard.allShipsSunk() == true) {
    displayWinner(computer);
  } else if (computer.gameboard.allShipsSunk() == true) {
    displayWinner(player);
  }
};

export { gameSetup, activeClass, currentShipLength, direction };
