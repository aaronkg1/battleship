import "./style.css";
import _ from "lodash";
import ShipFactory from "./Ship";
import Computer from "./Computer";
import Gameboard from "./Gameboard";
import Player from "./Player";
import {
  addEventListenerToSquares,
  createPlayerFromInput,
  generateComputerGrid,
  generatePlayerGrid,
} from "./DOM-interaction";
import { gameSetup } from "./gameloop";
createPlayerFromInput();

// const gameLoop = async (player) => {
//   const playerOne = player;
//   playerOne.gameboard = Gameboard(playerOne.name);
//   const playerTwo = Player("Computer");
//   playerTwo.gameboard = Gameboard(playerTwo.name);
//   activeClass = "navy-ship";
//   currentShipLength = 2;
// };
