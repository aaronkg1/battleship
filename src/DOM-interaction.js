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

const waitForClick = async () => {
  const promiseArray = [];
  const allPlayerSquares = document.querySelectorAll(".player-square");
  const playerSquares = [...allPlayerSquares].filter(
    (square) =>
      square.className == "player-square" && !getImpossibleSquares(square)
  );
  const occupiedSquares = [...allPlayerSquares].filter(
    (square) => square.className != "player-square"
  );
  playerSquares.forEach((square) => {
    const click = new Promise((resolve, reject) => {
      occupiedSquares.forEach((square) => {
        square.removeEventListener("mouseover", addClassToElements);
        square.removeEventListener("click", addClassToElements);
        square.removeEventListener("mouseout", removeClassFromElements);
        square.removeEventListener("click", getCoordinatesToPlaceShip);
        square.addEventListener("click", function repeat() {
          square.removeEventListener("click", repeat);
          resolve(addEventListenerToSquares());
        });
      });

      square.addEventListener("mouseover", addClassToElements);
      square.addEventListener("mouseout", removeClassFromElements);
      square.addEventListener("click", addClassToElements);
      square.addEventListener("click", getCoordinatesToPlaceShip);
      square.addEventListener("click", function eventHandler() {
        square.removeEventListener("click", eventHandler);
        playerSquares.forEach((otherSquare) => {
          otherSquare.removeEventListener("mouseover", addClassToElements);
          otherSquare.removeEventListener("click", addClassToElements);
          otherSquare.removeEventListener("mouseout", removeClassFromElements);
          otherSquare.removeEventListener("click", getCoordinatesToPlaceShip);
          otherSquare.removeEventListener("click", eventHandler);
        });
      });
      square.addEventListener("click", function end() {
        square.removeEventListener("click", end);
        square.removeEventListener("mouseover", addClassToElements);
        square.removeEventListener("click", addClassToElements);
        square.removeEventListener("mouseout", removeClassFromElements);
        square.removeEventListener("click", getCoordinatesToPlaceShip);
        resolve();
      });
    });
    promiseArray.push(click);
  });
  await Promise.race(promiseArray);
};

const removeEventListeners = () => {
  const playerSquares = document.querySelectorAll(".player-square");
  playerSquares.forEach((square) => {
    square.removeEventListener("mouseover", addClassToElements);
    square.removeEventListener("click", addClassToElements);
    square.removeEventListener("mouseout", removeClassFromElements);
    square.removeEventListener("click", getCoordinatesToPlaceShip);
  });
};

const getImpossibleSquares = (square) => {
  if (direction == "horizontal") {
    if (currentShipLength == 2) {
      if (square.value[1] > 5) {
        return true;
      } else return false;
    }
    if (currentShipLength == 3) {
      if (square.value[1] > 4) {
        return true;
      } else return false;
    }
    if (currentShipLength == 4) {
      if (square.value[1] > 3) {
        return true;
      } else return false;
    }
  } else if (direction == "vertical") {
    if (currentShipLength == 2) {
      if (square.value[0] > 5) {
        return true;
      } else return false;
    }
    if (currentShipLength == 3) {
      if (square.value[0] > 4) {
        return true;
      } else return false;
    }
    if (currentShipLength == 4) {
      if (square.value[0] > 3) {
        return true;
      } else return false;
    }
  }
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
      currentCoordinates = [adjacentSquares[0].value, adjacentSquares[1].value];
    }
  }
  if (currentShipLength == 3) {
    if (adjacentSquares.length >= 3) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-middle`);
      adjacentSquares[2].classList.add(`${activeClass}-end`);
      currentCoordinates = [
        adjacentSquares[0].value,
        adjacentSquares[1].value,
        adjacentSquares[2].value,
      ];
    }
  }
  if (currentShipLength == 4) {
    if (adjacentSquares.length >= 4) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-middle-start`);
      adjacentSquares[2].classList.add(`${activeClass}-middle-end`);
      adjacentSquares[3].classList.add(`${activeClass}-end`);
      currentCoordinates = [
        adjacentSquares[0].value,
        adjacentSquares[1].value,
        adjacentSquares[2].value,
        adjacentSquares[3].value,
      ];
    }
  }
};

const addClassToComputerSquares = (coordinates, shipName) => {
  const computerSquares = document.querySelectorAll(".computer-square");

  if (coordinates.length == 2) {
    computerSquares.forEach((square) => {
      square.classList.add("hidden");
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
    newPlayer.classList.add("hide");
  });
};

const displayComputerHits = (gameboard) => {
  const board = gameboard.board;
  const playerSquares = document.querySelectorAll(".player-square");
  playerSquares.forEach((square) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (board[i][j].coordinates.toString() == square.value.toString()) {
          if (board[i][j].hit == true) {
            square.classList.add("hit");
            if (square.className != "player-square hit") {
              square.classList.add("success");
            }
          }
        }
      }
    }
  });
};

const attackSquares = () => {
  return new Promise((resolve) => {
    const computerSquares = document.querySelectorAll(".computer-square");
    const unhitSquares = [];
    computerSquares.forEach((square) => {
      if (!square.className.includes("hit")) {
        unhitSquares.push(square);
      }
    });
    unhitSquares.forEach((square) => {
      square.addEventListener("click", function getSquareValue() {
        square.classList.add("hit");
        for (let i = 0; i < computerSquares.length; i++) {
          computerSquares[i].removeEventListener("click", getSquareValue);
        }
        square.removeEventListener("click", getSquareValue);

        resolve(square.value);
      });
    });
  });
};

const attackComputerSquare = async () => {
  const computerSquares = document.querySelectorAll(".computer-square");
  const unhitSquares = [];
  computerSquares.forEach((square) => {
    if (!square.className.includes("hit")) {
      unhitSquares.push(square);
    }
  });
  const attackValue = await createPromiseFromDomEvent(unhitSquares, "click");
  return attackValue;
};

const createPromiseFromDomEvent = (eventTargets, eventName) =>
  new Promise((resolve) => {
    const getSquareValue = (e) => {
      e.target.removeEventListener(eventName, getSquareValue);
      eventTargets.forEach((eventTarget) => {
        eventTarget.removeEventListener(eventName, getSquareValue);
      });
      resolve(e.target.value);
      e.target.classList.add("hit");
      if (e.target.className != "computer-square hidden hit") {
        e.target.classList.add("success");
      }
    };
    eventTargets.forEach((eventTarget) => {
      eventTarget.addEventListener(eventName, getSquareValue);
    });
  });

const displaySunkShips = (sunkShips) => {
  if (sunkShips.length == 0) {
    return;
  }
  sunkShips.forEach((ship) => {
    const shipName = ship.name;
    const computerSquares = document.querySelectorAll(".computer-square");
    computerSquares.forEach((square) => {
      if (square.className.includes(shipName)) {
        square.classList.remove("hidden");
      }
    });
  });
};

export {
  generatePlayerGrid,
  generateComputerGrid,
  createPlayerFromInput,
  waitForClick,
  removeEventListeners,
  getCoordinatesToPlaceShip,
  addClassToComputerSquares,
  attackSquares,
  currentCoordinates,
  attackComputerSquare,
  displaySunkShips,
  displayComputerHits,
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
