import ShipFactory from "./src/Ship";

test.skip("sets correct ship length", () => {
  const newShip = ShipFactory(3, "bomber");
  expect(newShip.length).toBe(3);
});

test.skip("sets correct ship name", () => {
  const newShip = ShipFactory(3, "bomber");
  expect(newShip.name).toBe("bomber");
});

test.skip("New ship is not sunk", () => {
  const newShip = ShipFactory(3, "bomber");
  expect(newShip.isSunk()).toBe(false);
});

test.skip("Ship that is not fully hit is not sunk", () => {
  const newShip = ShipFactory(3, "bomber");
  newShip.hit(0);
  newShip.hit(1);
  expect(newShip.isSunk()).toBe(false);
});

test.skip("Fully hit ship is sunk", () => {
  const newShip = ShipFactory(3, "bomber");
  newShip.hit(0);
  newShip.hit(1);
  newShip.hit(2);
  expect(newShip.isSunk()).toBe(true);
});
