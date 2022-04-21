import Computer from "./src/Computer";
import Player from "./src/Player";
import Gameboard from "./src/Gameboard";
import ShipFactory from "./src/Ship";
import _ from "lodash";

test("Computer can be created", () => {
  const computer = Computer();
  expect(computer.name).toBe("Computer");
});

test("Computer can make a random move", () => {
  const computer = Computer();
  const newBoard = Gameboard(`New board`);
  expect(computer.makeRandomMove(newBoard)).toBe("Shot missed");
});

test("Computer can make an educated move", () => {
  const computer = Computer();
  computer.gameboard = Gameboard("Computer Board");
  computer.gameboard.placeShip(
    [
      [4, 6],
      [5, 6],
      [6, 6],
    ],
    ShipFactory(3, "test")
  );
  computer.gameboard.receiveAttack([5, 6]);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);

  expect(computer.gameboard.board[5][6].ship.isSunk()).toBe(true);
});
test("Computer can make an educated move", () => {
  const computer = Computer();
  computer.gameboard = Gameboard("Computer Board");
  computer.gameboard.placeShip(
    [
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    ShipFactory(3, "test")
  );
  computer.gameboard.receiveAttack([1, 0]);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  expect(computer.gameboard.board[1][0].ship.isSunk()).toBe(true);
});

test("Computer can make an educated move on a board with multiple ships", () => {
  const computer = Computer();
  computer.gameboard = Gameboard("Computer Board");
  computer.gameboard.placeShip(
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    ShipFactory(3, "ship1")
  );
  computer.gameboard.placeShip(
    [
      [3, 0],
      [3, 1],
      [3, 2],
    ],
    ShipFactory(3, "ship2")
  );
  computer.gameboard.placeShip(
    [
      [6, 6],
      [5, 6],
      [4, 6],
      [3, 6],
    ],
    ShipFactory(4, "ship3")
  );

  computer.gameboard.receiveAttack([6, 6]);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  computer.makeMove(computer.gameboard);
  console.log(computer.gameboard.board);
  expect(computer.gameboard.board[6][6].ship.isSunk()).toBe(true);
});
