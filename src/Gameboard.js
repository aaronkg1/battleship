const Gameboard = (name) => {
  const ships = [];
  const board = [];
  const boardInit = (() => {
    for (let x = 0; x < 7; x++) {
      const column = [];
      for (let y = 0; y < 7; y++) {
        column.push({
          hit: false,
          empty: true,
          coordinates: [x, y],
        });
      }
      board.push(column);
    }
  })();
  const placeShip = (coords, boat) => {
    const coordinates = coords;
    const ship = boat;
    let positionEmpty = true;
    if (coordinates.length !== ship.length) {
      return false;
    }
    coordinates.forEach((coordinate) => {
      const xCoord = coordinate[0];
      const yCoord = coordinate[1];
      const position = board[xCoord][yCoord];

      if (position.empty == false) {
        positionEmpty = false;
        return positionEmpty;
      }
    });
    if (positionEmpty == true) {
      for (let i = 0; i < coordinates.length; i++) {
        const xCoord = coordinates[i][0];
        const yCoord = coordinates[i][1];
        const position = board[xCoord][yCoord];
        position.empty = false;
        position.ship = ship;
        position.shipSegment = ship.segments[i].segment;
      }
      ships.push(ship);
      return true;
    }
  };
  const receiveAttack = (coordinates) => {
    const position = board[coordinates[0]][coordinates[1]];
    if (position.empty === false) {
      const shipAttacked = position.ship;
      const shipName = shipAttacked.name;
      const shipSegment = position.shipSegment;
      const attackedSegment = shipAttacked.segments[shipSegment];
      if (attackedSegment.hit === false) {
        position.hit = true;
        shipAttacked.hit(shipSegment);
        if (shipAttacked.isSunk() === true) {
          return `${shipName} sunk`;
        } else return `${shipName} hit`;
      } else return `${shipName} already hit in segment`;
    } else if (position.hit === true) {
      return "Position already attacked";
    } else position.hit = true;
    return "Shot missed";
  };
  const allShipsSunk = () => {
    let shipsSunk = true;
    ships.forEach((ship) => {
      if (ship.isSunk() === false) {
        shipsSunk = false;
      }
    });
    return shipsSunk;
  };
  return { board, placeShip, name, ships, receiveAttack, allShipsSunk };
};

export default Gameboard;
