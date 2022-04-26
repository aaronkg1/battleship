import Player from "./Player";
import { activeClass, currentShipLength, direction } from "./gameloop";
import { addClassToComputerSquares } from "./DOM-interaction";

const Computer = () => {
  const newComputer = Object.assign(Player("Computer"), {
    makeRandomMove: (gameboard) => {
      const randomX = Math.floor(Math.random() * 7);
      const randomY = Math.floor(Math.random() * 7);
      const board = gameboard.board;
      if (board[randomX][randomY].hit === false) {
        return gameboard.receiveAttack([randomX, randomY]);
      } else if (board[randomX][randomY].hit === true) {
        makeRandomMove();
      }
    },
    placeShipRandomly: (ship, gameboard) => {
      const board = gameboard.board;
      const coordinates = [];
      let upOrDown = Math.floor(Math.random() * 2);
      if (upOrDown === 0) {
        direction = "horizontal";
      } else direction = "vertical";

      if (direction == "horizontal") {
        if (ship.length == 2) {
          const randomRow = Math.floor(Math.random() * 7);
          const randomY = Math.floor(Math.random() * 6);
          coordinates.push([randomRow, randomY], [randomRow, randomY + 1]);
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
        if (ship.length == 3) {
          const randomRow = Math.floor(Math.random() * 7);
          const randomY = Math.floor(Math.random() * 5);
          coordinates.push(
            [randomRow, randomY],
            [randomRow, randomY + 1],
            [randomRow, randomY + 2]
          );
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
        if (ship.length == 4) {
          const randomRow = Math.floor(Math.random() * 7);
          const randomY = Math.floor(Math.random() * 4);
          coordinates.push(
            [randomRow, randomY],
            [randomRow, randomY + 1],
            [randomRow, randomY + 2],
            [randomRow, randomY + 3]
          );
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
      }
      if (direction == "vertical") {
        if (ship.length == 2) {
          const randomRow = Math.floor(Math.random() * 6);
          const randomY = Math.floor(Math.random() * 7);
          coordinates.push([randomRow, randomY], [randomRow + 1, randomY]);
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
        if (ship.length == 3) {
          const randomRow = Math.floor(Math.random() * 5);
          const randomY = Math.floor(Math.random() * 7);
          coordinates.push(
            [randomRow, randomY],
            [randomRow + 1, randomY],
            [randomRow + 2, randomY]
          );
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
        if (ship.length == 4) {
          const randomRow = Math.floor(Math.random() * 4);
          const randomY = Math.floor(Math.random() * 7);
          coordinates.push(
            [randomRow, randomY],
            [randomRow + 1, randomY],
            [randomRow + 2, randomY],
            [randomRow + 3, randomY]
          );
          if (gameboard.placeShip(coordinates, ship) != true) {
            newComputer.placeShipRandomly(ship, gameboard);
          } else {
            addClassToComputerSquares(coordinates, ship.name);
          }
        }
      }
    },
    makeMove: (gameboard) => {
      const board = gameboard.board;
      let hits = [];
      let unSunkCoordX;
      let unSunkCoordY;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j].hit === true && board[i][j].empty === false) {
            if (board[i][j].ship.isSunk() === false) {
              hits.push(board[i][j]);
            }
          }
        }
      }
      if (hits.length > 0) {
        unSunkCoordX = hits[0].coordinates[0];
        unSunkCoordY = hits[0].coordinates[1];
      }

      let direction = false;
      if (hits.length === 1) {
        // if one hit, try up down bottom left
        if (
          unSunkCoordX - 1 >= 0 &&
          board[unSunkCoordX - 1][unSunkCoordY].hit === false
        ) {
          return gameboard.receiveAttack([unSunkCoordX - 1, unSunkCoordY]);
        } else if (
          unSunkCoordY + 1 < 7 &&
          board[unSunkCoordX][unSunkCoordY + 1].hit === false
        ) {
          return gameboard.receiveAttack([unSunkCoordX, unSunkCoordY + 1]);
        } else if (
          unSunkCoordX + 1 < 7 &&
          board[unSunkCoordX + 1][unSunkCoordY].hit === false
        ) {
          return gameboard.receiveAttack([unSunkCoordX + 1, unSunkCoordY]);
        } else if (
          unSunkCoordY - 1 >= 0 &&
          board[unSunkCoordX][unSunkCoordY - 1].hit === false
        ) {
          return gameboard.receiveAttack([unSunkCoordX, unSunkCoordY - 1]);
        }
      } else if (hits.length > 1) {
        const secondXCoord = hits[1].coordinates[0];
        const secondYCoord = hits[1].coordinates[1];
        if (
          secondXCoord === (unSunkCoordX + 1 || unSunkCoordX - 1) &&
          unSunkCoordY === hits[1].coordinates[1]
        ) {
          direction = "vertical";
        } else if (
          secondXCoord === unSunkCoordX &&
          secondYCoord === (unSunkCoordY + 1 || unSunkCoordY - 1)
        ) {
          direction = "horizontal";
        }
        if (direction === "vertical") {
          // if vertical try and hit the surrounding vertical 3 on either side
          if (
            secondXCoord - 1 >= 0 &&
            board[secondXCoord - 1][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord - 1, secondYCoord]);
          } else if (
            secondXCoord + 1 < 7 &&
            board[secondXCoord + 1][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord + 1, secondYCoord]);
          } else if (
            secondXCoord - 2 >= 0 &&
            board[secondXCoord - 2][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord - 2, secondYCoord]);
          } else if (
            secondXCoord + 2 < 7 &&
            board[secondXCoord + 2][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord + 2, secondYCoord]);
          } else if (
            secondXCoord - 3 >= 0 &&
            board[secondXCoord - 3][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord - 3, secondYCoord]);
          } else if (
            secondXCoord + 3 < 7 &&
            board[secondXCoord + 3][secondYCoord].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord + 3, secondYCoord]);
          }
        } else if (direction === "horizontal") {
          // try and hit the surrounding horizontal 3 on either side
          if (
            secondYCoord + 1 < 7 &&
            board[secondXCoord][secondYCoord + 1].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord + 1]);
          } else if (
            secondYCoord - 1 >= 0 &&
            board[secondXCoord][secondYCoord - 1].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord - 1]);
          } else if (
            secondYCoord + 2 < 7 &&
            board[secondXCoord][secondYCoord + 2].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord + 2]);
          } else if (
            secondYCoord - 2 >= 0 &&
            board[secondXCoord][secondYCoord - 2].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord - 2]);
          } else if (
            secondYCoord + 3 < 7 &&
            board[secondXCoord][secondYCoord + 3].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord + 3]);
          } else if (
            secondYCoord - 3 >= 0 &&
            board[secondXCoord][secondYCoord - 3].hit === false
          ) {
            return gameboard.receiveAttack([secondXCoord, secondYCoord - 3]);
          }
        } else if (!direction) {
          newComputer.makeRandomMove(gameboard);
        }
      } else {
        newComputer.makeRandomMove(gameboard);
      }
    },
  });
  return newComputer;
};

export default Computer;
