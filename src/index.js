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
