import { remove, toLower, capitalize } from "lodash";
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
      square.classList.add("hidden");
      square.value = [i, j];
      row.appendChild(square);
    }
    computerGrid.appendChild(row);
  }
};

const removeEventListeners = () => {
  const allPlayerSquares = document.querySelectorAll(".player-square");
  const squareValues = [];
  allPlayerSquares.forEach((square) => {
    squareValues.push(square.value);
  });

  for (let i = 0; i < allPlayerSquares.length; i++) {
    const newElement = allPlayerSquares[i].cloneNode(true);
    allPlayerSquares[i].replaceWith(newElement);
    newElement.value = squareValues[i];
  }
};

const waitForClick = async () => {
  removeEventListeners();
  const promiseArray = [];

  const allPlayerSquares = document.querySelectorAll(".player-square");
  const playerSquares = [...allPlayerSquares].filter(
    (square) =>
      square.className == "player-square" &&
      !getImpossibleSquares(square) &&
      areNextSquaresEmpty(square)
  );
  const occupiedSquares = [...allPlayerSquares].filter(
    (square) => square.className != "player-square"
  );

  playerSquares.forEach((square) => {
    const click = new Promise((resolve, reject) => {
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

  const rotateButton = document.querySelector(".rotate-btn");
  const rotateClick = new Promise((resolve) => {
    rotateButton.addEventListener("click", changeDirection);
    rotateButton.addEventListener("click", function eventHandler() {
      rotateButton.removeEventListener("click", eventHandler);
      rotateButton.removeEventListener("click", changeDirection);
      resolve("rotate");
    });
  });
  promiseArray.push(rotateClick);
  return Promise.race(promiseArray).then((value) => {
    return new Promise((resolve) => {
      if (value == "rotate") {
        resolve(waitForClick());
      } else resolve();
    });
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
  }
  if (direction == "vertical") {
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

const changeDirection = () => {
  if (direction == "horizontal") {
    direction = "vertical";
  } else if (direction == "vertical") {
    direction = "horizontal";
  }
  return;
};

const areNextSquaresEmpty = (square) => {
  const playerSquares = document.querySelectorAll(".player-square");
  const squareValue = square.value;
  let x;
  let y;

  if (direction == "horizontal") {
    x = 0;
    y = 1;
  }
  if (direction == "vertical") {
    x = 1;
    y = 0;
  }

  if (currentShipLength == 2) {
    const nextSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 1
    );
    if (nextSquare[0].className == "player-square") {
      return true;
    } else return false;
  }
  if (currentShipLength == 3) {
    const nextSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 1
    );
    const lastSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 2
    );
    if (
      nextSquare[0].className == "player-square" &&
      lastSquare[0].className == "player-square"
    ) {
      return true;
    } else return false;
  }
  if (currentShipLength == 4) {
    const nextSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 1
    );
    const middleSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 2
    );
    const lastSquare = [...playerSquares].filter(
      (square) =>
        square.value[x] == squareValue[x] &&
        square.value[y] == squareValue[y] + 3
    );
    if (
      nextSquare[0].className == "player-square" &&
      middleSquare[0].className == "player-square" &&
      lastSquare[0].className == "player-square"
    ) {
      return true;
    } else return false;
  }
};

function getAdjacentSquares(e, squareList) {
  const squareRowValue = e[0];
  const squareColumnValue = e[1];

  const squareArray = [];

  for (const square of squareList) {
    if (direction == "horizontal") {
      for (let i = 0; i < 4; i++) {
        if (
          square.value[0] == squareRowValue &&
          square.value[1] == squareColumnValue + i
        ) {
          squareArray.push(square);
        }
      }
    }
    if (direction == "vertical") {
      for (let i = 0; i < 4; i++) {
        if (
          square.value[1] == squareColumnValue &&
          square.value[0] == squareRowValue + i
        ) {
          squareArray.push(square);
        }
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
    for (let i = 0; i < 2; i++) {
      adjacentSquares[i].classList.add("occupied");
    }
  }
  if (currentShipLength == 3) {
    if (adjacentSquares.length >= 3) {
      currentCoordinates = [
        adjacentSquares[0].value,
        adjacentSquares[1].value,
        adjacentSquares[2].value,
      ];
      for (let i = 0; i < 3; i++) {
        adjacentSquares[i].classList.add("occupied");
      }
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
      for (let i = 0; i < 4; i++) {
        adjacentSquares[i].classList.add("occupied");
      }
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

  if (currentShipLength == 2) {
    if (adjacentSquares.length >= 2) {
      adjacentSquares[0].classList.add(`${activeClass}-start`);
      adjacentSquares[1].classList.add(`${activeClass}-end`);
      currentCoordinates = [adjacentSquares[0].value, adjacentSquares[1].value];
      if (direction == "vertical") {
        for (let i = 0; i < 2; i++) {
          adjacentSquares[i].classList.add("vertical");
        }
      }
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
      if (direction == "vertical") {
        for (let i = 0; i < 3; i++) {
          adjacentSquares[i].classList.add("vertical");
        }
      }
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
      if (direction == "vertical") {
        for (let i = 0; i < 4; i++) {
          adjacentSquares[i].classList.add("vertical");
        }
      }
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

  if (direction == "vertical") {
    adjacentSquares.forEach((square) => {
      if (!square.className.includes("occupied")) {
        square.classList.remove("vertical"); // prevents removing the vertical class from placed vertical ships
      }
    });
  }

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
  const submitButton = document.querySelector("#submit");
  const playerInput = document.querySelector("#player-name");
  playerInput.focus();
  submitButton.addEventListener("click", () => {
    const playerName = playerInput.value;
    newPlayer.classList.add("hide");
    const player = Player(`${playerName}`);
    player.name = playerName;
    gameSetup(player);
  });
  playerInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      const playerName = playerInput.value;
      newPlayer.classList.add("hide");
      const player = Player(`${playerName}`);
      player.name = playerName;
      gameSetup(player);
    }
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

const displayWinner = (winner) => {
  const winnerDisplay = document.querySelector(".player-wins");
  const playAgain = document.querySelector("#play-again");
  const winnerName = _.capitalize(winner.name);
  winnerDisplay.textContent = winnerName + " wins!";
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  playAgain.addEventListener("click", function playAgain() {
    location.reload();
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

const hideRotateBtn = () => {
  const rotateButton = document.querySelector(".rotate-btn");
  rotateButton.classList.add("hide");
};

const revealComputerBoard = () => {
  const computerBoard = document.querySelector(".computer-board");
  computerBoard.classList.remove("hide");
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
  displayWinner,
  hideRotateBtn,
  revealComputerBoard,
};
