const Gameboard = (name) => {
  const ships = [];
  const sunkShips = [];
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

      if (!position.empty) {
        positionEmpty = false;
        return positionEmpty;
      }
    });
    if (!!positionEmpty) {
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
    if (!position.empty) {
      const shipAttacked = position.ship;
      const shipName = shipAttacked.name;
      const shipSegment = position.shipSegment;
      const attackedSegment = shipAttacked.segments[shipSegment];
      position.hit = true;
      if (!attackedSegment.hit) {
        position.hit = true;
        shipAttacked.hit(shipSegment);
        if (shipAttacked.isSunk() === true) {
          sunkShips.push(position.ship);
          return `${shipName} sunk`;
        } else return `Ship hit`;
      }
    } else if (position.hit === true) {
      return "Position already attacked";
    } else position.hit = true;
    return "Shot missed";
  };
  const allShipsSunk = () => {
    if (sunkShips.length == ships.length) {
      return true;
    } else return false;
  };
  return {
    board,
    placeShip,
    name,
    ships,
    sunkShips,
    receiveAttack,
    allShipsSunk,
  };
};

export default Gameboard;
