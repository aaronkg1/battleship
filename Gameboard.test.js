import Gameboard from "./src/Gameboard";
import ShipFactory from "./src/Ship";

test("Gameboard creates an empty board", () => {
  const newBoard = Gameboard("Player1");
  expect(newBoard.board[0][0].empty).toBe(true);
});

test("Gameboard creates a 7 x 7 board", () => {
  const newBoard = Gameboard("Player1");
  expect(newBoard.board[0][7]).toBe(undefined);
  expect(newBoard.board[0][6].empty).toBe(true);
});

test("Can place a ship", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  expect(
    newBoard.placeShip(
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      newShip
    )
  ).toBe("Ship placed");
});
test("Cannot place if ship does not fit", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  expect(
    newBoard.placeShip(
      [
        [0, 0],
        [0, 1],
      ],
      newShip
    )
  ).toBe("Coordinates must match ship length");
});

// test("Ship segments correctly labeled", () => {
//   const newBoard = Gameboard("Player1");
//   const newShip = ShipFactory(3, "Bomber");
//   newBoard.placeShip(
//     [
//       [0, 0],
//       [0, 1],
//       [0, 2],
//     ],
//     newShip
//   );
//   expect(newBoard.board[0][0].shipSegment).toBe(0);
//   expect(newBoard.board[0][1].shipSegment).toBe(1);
//   expect(newBoard.board[0][2].shipSegment).toBe(2);
// });

test.skip("Ship can be hit on board", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  newBoard.board.push(newShip);
  newBoard.placeShip(
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    newShip
  );
  expect(newBoard.receiveAttack([0, 0])).toBe("Bomber hit");
});

test.skip("Ship can be sunk on gameboard", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  newBoard.placeShip(
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    newShip
  );
  newBoard.receiveAttack([0, 0]);
  newBoard.receiveAttack([0, 1]);
  expect(newBoard.receiveAttack([0, 2])).toBe("Bomber sunk");
});
test.skip("Gameboard can report if all ships have been sunk", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  newBoard.ships.push(newShip);
  newBoard.placeShip(
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    newShip
  );

  newBoard.receiveAttack([0, 0]);
  newBoard.receiveAttack([0, 1]);
  newBoard.receiveAttack([0, 2]);
  expect(newBoard.allShipsSunk()).toBe(true);
});
test.skip("Gameboard reports false if not all ships have been sunk", () => {
  const newBoard = Gameboard("Player1");
  const newShip = ShipFactory(3, "Bomber");
  const newShip2 = ShipFactory(5, "Carrier");
  newBoard.ships.push(newShip);
  newBoard.ships.push(newShip2);
  newBoard.placeShip(
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    newShip
  );
  newBoard.placeShip(
    [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ],
    newShip2
  );
  newBoard.receiveAttack([0, 0]);
  newBoard.receiveAttack([0, 1]);
  newBoard.receiveAttack([0, 2]);
  expect(newBoard.allShipsSunk()).toBe(false);
});
