import { remove, toLower } from "lodash";
import { activeClass, currentShipLength, direction } from "./gameloop";
import Player from "./Player";
import { gameSetup } from "./gameloop";

let currentCoordinates;

const generatePlayerGrid = () => {
  const playerGrid = document.querySelector(".player-board");
  for (let i = 0; i < 7; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 7; j++) {
      const square = document.createElement("div");
      square.classList.add("player-square");
      square.value = [i, j];
      row.appendChild(square);
    }
    playerGrid.appendChild(row);
  }
};

const generateComputerGrid = () => {
  const computerGrid = document.querySelector(".computer-board");
  for (let i = 0; i < 7; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 7; j++) {
      const square = document.createElement("div");
      square.classList.add("computer-square");
      square.value = [i, j];
      row.appendChild(square);
    }
    computerGrid.appendChild(row);
  }
};

const addEventListenerToSquares = () => {
  return new Promise((resolve, reject) => {
    const allPlayerSquares = document.querySelectorAll(".player-square");
    const playerSquares = [];
    const occupiedSquares = [];
    // Prevents placing ship in an Occupied space
    allPlayerSquares.forEach((square) => {
      if (square.className === "player-square") {
        playerSquares.push(square);
      }
      if (square.className != "player-square") {
        occupiedSquares.push(square);
      }
    });

    occupiedSquares.forEach((square) => {
      square.addEventListener("click", () => {
        resolve(addEventListenerToSquares());
      });
    });

    playerSquares.forEach((square) => {
      square.addEventListener("mouseover", addClassToElements);
      square.addEventListener("mouseout", removeClassFromElements);
      square.addEventListener("click", addClassToElements);
      square.addEventListener("click", getCoordinatesToPlaceShip);
      square.addEventListener("click", () => {
        playerSquares.forEach((otherSquare) => {
          otherSquare.removeEventListener("mouseover", addClassToElements);
          otherSquare.removeEventListener("click", addClassToElements);
          otherSquare.removeEventListener("mouseout", removeClassFromElements);
          otherSquare.removeEventListener("click", getCoordinatesToPlaceShip);
        });
      });
      square.addEventListener("click", () => {
        square.removeEventListener("mouseover", addClassToElements);
        square.removeEventListener("click", addClassToElements);
        square.removeEventListener("mouseout", removeClassFromElements);
        square.removeEventListener("click", getCoordinatesToPlaceShip);
        resolve(currentCoordinates);
      });
    });
  });
};

function getAdjacentSquares(e, squareList) {
  const squareRowValue = e[0];
  const squareColumnValue = e[1];

  const squareArray = [];

  for (const square of squareList) {
    if (direction == "horizontal") {
      if (
        square.value[0] == squareRowValue &&
        square.value[1] == squareColumnValue
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue &&
        square.value[1] == squareColumnValue + 1
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue &&
        square.value[1] == squareColumnValue + 2
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue &&
        square.value[1] == squareColumnValue + 3
      ) {
        squareArray.push(square);
      }
    }
    if (direction == "vertical") {
      if (
        square.value[0] == squareRowValue &&
        square.value[1] == squareColumnValue
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue + 1 &&
        square.value[1] == squareColumnValue
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue + 2 &&
        square.value[1] == squareColumnValue
      ) {
        squareArray.push(square);
      }
      if (
        square.value[0] == squareRowValue + 3 &&
        square.value[1] == squareColumnValue
      ) {
        squareArray.push(square);
      }
    }
  }

  return squareArray;
}

const getCoordinatesToPlaceShip = (e) => {
  const currentValue = e.target.value;
  const playerSquares = document.getElementsByClassName("player-square");
  const adjacentSquares = getAdjacentSquares(currentValue, playerSquares);
  if (currentShipLength == 2) {
    if (adjacentSquares.length >= 2) {
      currentCoordinates = [adjacentSquares[0].value, adjacentSquares[1].value];
    }
  }
  if (currentShipLength == 3) {
    if (adjacentSquares.length >= 3) {
      currentCoordinates = [
        adjacentSquares[0].value,
        adjacentSquares[1].value,
        adjacentSquares[2].value,
      ];
    }
  }
  if (currentShipLength == 4) {
    if (adjacentSquares.length >= 3) {
      currentCoordinates = [
        adjacentSquares[0].value,
        adjacentSquares[1].value,
        adjacentSquares[2].value,
        adjacentSquares[3].value,
      ];
    }
  }
};

const addClassToElements = (e) => {
  const currentValue = e.target.value;
  const allPlayerSquares = document.querySelectorAll(".player-square");
  const playerSquares = [];
  allPlayerSquares.forEach((square) => {
    if (square.className === "player-square") {
      playerSquares.push(square);
    }
  });
  const adjacentSquares = getAdjacentSquares(currentValue, playerSquares);

  if (direction == "vertical") {
    playerSquares.forEach((square) => {
      square.classList.add("vertical");
    });
  }

  if (currentShipLength == 2) {
    if (adjacentSquares.length >= 2) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-end`);
    }
  }
  if (currentShipLength == 3) {
    if (adjacentSquares.length >= 3) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-middle`);
      adjacentSquares[2].classList.add(`${activeClass}-end`);
    }
  }
  if (currentShipLength == 4) {
    if (adjacentSquares.length >= 4) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-middle-start`);
      adjacentSquares[2].classList.add(`${activeClass}-middle-end`);
      adjacentSquares[3].classList.add(`${activeClass}-end`);
    }
  }
};

const addClassToComputerSquares = (coordinates, shipName) => {
  const computerSquares = document.querySelectorAll(".computer-square");
  if (coordinates.length == 2) {
    computerSquares.forEach((square) => {
      if (
        square.value[0] == coordinates[0][0] &&
        square.value[1] == coordinates[0][1]
      ) {
        square.classList.add(`${shipName}-start`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[1][0] &&
        square.value[1] == coordinates[1][1]
      ) {
        square.classList.add(`${shipName}-end`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
    });
  }
  if (coordinates.length == 3) {
    computerSquares.forEach((square) => {
      if (
        square.value[0] == coordinates[0][0] &&
        square.value[1] == coordinates[0][1]
      ) {
        square.classList.add(`${shipName}-start`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[1][0] &&
        square.value[1] == coordinates[1][1]
      ) {
        square.classList.add(`${shipName}-middle`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[2][0] &&
        square.value[1] == coordinates[2][1]
      ) {
        square.classList.add(`${shipName}-end`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
    });
  }
  if (coordinates.length == 4) {
    computerSquares.forEach((square) => {
      if (
        square.value[0] == coordinates[0][0] &&
        square.value[1] == coordinates[0][1]
      ) {
        square.classList.add(`${shipName}-start`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[1][0] &&
        square.value[1] == coordinates[1][1]
      ) {
        square.classList.add(`${shipName}-middle-start`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[2][0] &&
        square.value[1] == coordinates[2][1]
      ) {
        square.classList.add(`${shipName}-middle-end`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
      if (
        square.value[0] == coordinates[3][0] &&
        square.value[1] == coordinates[3][1]
      ) {
        square.classList.add(`${shipName}-end`);
        if (direction == "vertical") {
          square.classList.add("vertical");
        }
      }
    });
  }
};

const removeClassFromElements = (e) => {
  const currentValue = e.target.value;
  const playerSquares = document.querySelectorAll(".player-square");
  const adjacentSquares = getAdjacentSquares(currentValue, playerSquares);

  playerSquares.forEach((square) => {
    square.classList.remove("vertical");
  });

  if (currentShipLength == 2) {
    if (adjacentSquares.length >= 2) {
      adjacentSquares[0].classList.remove(`${activeClass}-start`);
      adjacentSquares[1].classList.remove(`${activeClass}-end`);
    }
  }
  if (currentShipLength == 3) {
    if (adjacentSquares.length >= 3) {
      adjacentSquares[0].classList.remove(`${activeClass}-start`);
      adjacentSquares[1].classList.remove(`${activeClass}-middle`);
      adjacentSquares[2].classList.remove(`${activeClass}-end`);
    }
  }
  if (currentShipLength == 4) {
    if (adjacentSquares.length >= 4) {
      adjacentSquares[0].classList.remove(`${activeClass}-start`);
      adjacentSquares[1].classList.remove(`${activeClass}-middle-start`);
      adjacentSquares[2].classList.remove(`${activeClass}-middle-end`);
      adjacentSquares[3].classList.remove(`${activeClass}-end`);
    }
  }
};

const createPlayerFromInput = () => {
  const newPlayer = document.querySelector(".new-player");
  const playerNameInput = document.querySelector("#player-name");
  const submitButton = document.querySelector("#submit");
  const playerName = playerNameInput.value;
  submitButton.addEventListener("click", () => {
    gameSetup(Player(playerName));
    newPlayer.classList.add("hidden");
  });
};

export {
  generatePlayerGrid,
  generateComputerGrid,
  createPlayerFromInput,
  addEventListenerToSquares,
  getCoordinatesToPlaceShip,
  addClassToComputerSquares,
};

// function addClassToSquares(squares, className) {
//   const squareOne = squares[0];
//   const squareTwo = squares[1];
//   const squareThree = squares[2];
//   squareOne.classList.add(`${className}-start`);
//   squareTwo.classList.add(`${className}-middle`);
//   squareThree.classList.add(`${className}-end`);
// }

// function removeClassFromSquares(squares, className) {
//   const squareOne = squares[0];
//   const squareTwo = squares[1];
//   const squareThree = squares[2];
//   squareOne.classList.remove(`${className}-start`);
//   squareTwo.classList.remove(`${className}-middle`);
//   squareThree.classList.remove(`${className}-end`);
// }
