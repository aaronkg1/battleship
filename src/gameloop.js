import Computer from "./Computer";
import {
  addEventListenerToSquares,
  generateComputerGrid,
  generatePlayerGrid,
  getCoordinatesToPlaceShip,
} from "./DOM-interaction";

import Gameboard from "./Gameboard";
import Player from "./Player";
import ShipFactory from "./Ship";
import { repeat } from "./utils";
let activeClass = "attacker";
let currentShipLength = 3;
let direction = "horizontal";

const gameSetup = async (player) => {
  const playerOne = player;
  playerOne.gameboard = Gameboard(playerOne.name);

  generatePlayerGrid();
  const attackerCoords = await addEventListenerToSquares();
  await playerOne.gameboard.placeShip(
    attackerCoords,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "bombarder";
  currentShipLength = 3;
  const bombarderCoords = await addEventListenerToSquares();
  await playerOne.gameboard.placeShip(
    bombarderCoords,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "submarine";
  currentShipLength = 4;
  const submarineCoords = await addEventListenerToSquares();
  await playerOne.gameboard.placeShip(
    submarineCoords,
    ShipFactory(currentShipLength, activeClass)
  );
  activeClass = "navy-ship";
  currentShipLength = 2;
  const navyCoords = await addEventListenerToSquares();
  await playerOne.gameboard.placeShip(
    navyCoords,
    ShipFactory(currentShipLength, activeClass)
  );
  const computer = Computer();
  computer.gameboard = Gameboard(computer.name);
  generateComputerGrid();
  activeClass = "attacker";
  currentShipLength = 3;
  await repeat(
    computer.placeShipRandomly(
      ShipFactory(currentShipLength, activeClass),
      computer.gameboard
    )
  );
  activeClass = "bombarder";
  currentShipLength = 3;
  await repeat(
    computer.placeShipRandomly(
      ShipFactory(currentShipLength, activeClass),
      computer.gameboard
    )
  );
  activeClass = "submarine";
  currentShipLength = 4;
  await repeat(
    computer.placeShipRandomly(
      ShipFactory(currentShipLength, activeClass),
      computer.gameboard
    )
  );
  activeClass = "navy-ship";
  currentShipLength = 2;
  await repeat(
    computer.placeShipRandomly(
      ShipFactory(currentShipLength, activeClass),
      computer.gameboard
    )
  );
  console.log(computer.gameboard);
};

export { gameSetup, activeClass, currentShipLength, direction };
