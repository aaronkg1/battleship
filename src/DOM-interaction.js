import { toLower } from "lodash";
import { activeClass, currentShipLength, direction } from "./index";

const generateGrids = () => {
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
  const playerSquares = document.querySelectorAll(".player-square");
  playerSquares.forEach((square) => {
    square.addEventListener("mouseover", addClassToElements);
    square.addEventListener("mouseout", removeClassFromElements);
    square.addEventListener("click", addClassToElements);
    square.addEventListener("click", () => {
      playerSquares.forEach((square) => {
        square.removeEventListener("mouseover", addClassToElements);
        square.removeEventListener("click", addClassToElements);
        square.removeEventListener("mouseout", removeClassFromElements);
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

const addClassToElements = (e) => {
  const currentValue = e.target.value;
  const playerSquares = document.querySelectorAll(".player-square");
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
export { generateGrids, addEventListenerToSquares };

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
