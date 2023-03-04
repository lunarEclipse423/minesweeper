const gameBoard = document.querySelector(".game-body");
const minesLeftCounter = document.querySelectorAll(".mines-left .digit");
const smile = document.querySelector(".smile");
let secondsTimer;
let flags = 0;
let cells = [];
let isGameOver = false;
let isFirstClick = true;
let width;
let mines;
let minesLeft;

const gameOver = () => {
  isGameOver = true;
  smile.classList.add("smile-game-over");
  clearInterval(secondsTimer);
  cells.forEach((cell) => {
    if (cell.classList.contains("mine")) {
      cell.classList.add("checked");
    }
    if (!cell.classList.contains("mine") && cell.classList.contains("flag")) {
      cell.classList.add("checked");
      cell.classList.add("mine-crossed");
    }
  });
};

const displayDigit = (domElement, digit, countOrder) => {
  const order = countOrder === "ascending" ? 1 : 0;
  switch (digit) {
    case "0":
      domElement.classList.remove(order ? "digit-nine" : "digit-one");
      domElement.classList.add("digit-zero");
      break;
    case "1":
      domElement.classList.remove(order ? "digit-zero" : "digit-two");
      domElement.classList.add("digit-one");
      break;
    case "2":
      domElement.classList.remove(order ? "digit-one" : "digit-three");
      domElement.classList.add("digit-two");
      break;
    case "3":
      domElement.classList.remove(order ? "digit-two" : "digit-four");
      domElement.classList.add("digit-three");
      break;
    case "4":
      domElement.classList.remove(order ? "digit-three" : "digit-five");
      domElement.classList.add("digit-four");
      break;
    case "5":
      domElement.classList.remove(order ? "digit-four" : "digit-six");
      domElement.classList.add("digit-five");
      break;
    case "6":
      domElement.classList.remove(order ? "digit-five" : "digit-seven");
      domElement.classList.add("digit-six");
      break;
    case "7":
      domElement.classList.remove(order ? "digit-six" : "digit-eight");
      domElement.classList.add("digit-seven");
      break;
    case "8":
      domElement.classList.remove(order ? "digit-seven" : "digit-nine");
      domElement.classList.add("digit-eight");
      break;
    case "9":
      domElement.classList.remove(order ? "digit-eight" : "digit-zero");
      domElement.classList.add("digit-nine");
      break;
  }
};

const startGameTimer = () => {
  const secondsClock = document.querySelectorAll(".current-time .digit");
  let seconds = 0;
  const secondsTimer = setInterval(() => {
    seconds += 1;
    const secondsText =
      seconds < 10 ? "00" + seconds : seconds < 100 ? "0" + seconds : "" + seconds;
    for (let i = 0; i < secondsText.length; i++) {
      displayDigit(secondsClock[i], secondsText[i], "ascending");
    }
  }, 1000);

  return secondsTimer;
};

const restartGame = () => {
  clearInterval(secondsTimer);
  let currenTime = document.querySelectorAll(".current-time .digit");
  let maxMines = document.querySelectorAll(".mines-left .digit");

  for (let i = 0; i < currenTime.length; i++) {
    currenTime[i].className = "current-time digit digit-zero";
  }

  const maxMinesText = mines < 10 ? "00" + mines : mines < 100 ? "0" + mines : "" + mines;
  for (let i = 0; i < maxMines.length; i++) {
    maxMines[i].className = "current-time digit";
    displayDigit(maxMines[i], maxMinesText[i], "ascending");
  }

  if (smile.classList.contains("smile-game-over")) {
    smile.classList.remove("smile-game-over");
  }

  if (smile.classList.contains("smile-win")) {
    smile.classList.remove("smile-win");
  }

  flags = 0;
  cells = [];
  isGameOver = false;
  isFirstClick = true;
  minesLeft = mines;
  gameBoard.textContent = "";
  createMap(width, mines);
};

const revealCell = (cellId) => {
  const cell = document.querySelector("#" + cellId);
  if (isGameOver) {
    return;
  }
  if (
    cell.classList.contains("checked") ||
    cell.classList.contains("flag") ||
    cell.classList.contains("question")
  ) {
    return;
  }

  if (cell.classList.contains("mine")) {
    if (isFirstClick) {
      restartGame();
      revealCell(cellId);
    } else {
      cell.classList.add("checked");
      cell.classList.add("mine-red");
      gameOver();
    }
  } else {
    if (isFirstClick) {
      secondsTimer = startGameTimer();
      isFirstClick = false;
    }
    let total = cell.getAttribute("data");
    if (total != 0) {
      cell.classList.add("checked");
      return;
    }
    cell.classList.add("empty");
    checkCell(cellId);
  }
  cell.classList.add("checked");
};

const toggleCellMark = (cell) => {
  if (isGameOver) {
    return;
  }
  if (!cell.classList.contains("checked") && flags < mines) {
    if (!cell.classList.contains("flag") && !cell.classList.contains("question")) {
      cell.classList.add("flag");
      flags++;
      if (cell.classList.contains("mine")) {
        minesLeft = minesLeft - 1;
        let minesLeftText =
          minesLeft < 10
            ? "00" + minesLeft
            : minesLeft < 100
            ? "0" + minesLeft
            : "" + minesLeft;
        for (let i = 0; i < minesLeftCounter.length; i++) {
          displayDigit(minesLeftCounter[i], minesLeftText[i], "descending");
        }
      }
      checkForWin();
    } else if (cell.classList.contains("flag")) {
      cell.classList.add("question");
      cell.classList.remove("flag");
      flags--;
      if (cell.classList.contains("mine")) {
        minesLeft = minesLeft + 1;
        let minesLeftText =
          minesLeft < 10
            ? "00" + minesLeft
            : minesLeft < 100
            ? "0" + minesLeft
            : "" + minesLeft;
        for (let i = 0; i < minesLeftCounter.length; i++) {
          displayDigit(minesLeftCounter[i], minesLeftText[i], "ascending");
        }
      }
    } else if (cell.classList.contains("question")) {
      cell.classList.remove("question");
    }
  }
};

const checkCell = (cellId) => {
  let currentId = +cellId.replace(/[^0-9]/g, "");
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1].id;
      revealCell(newId);
    }
    if (currentId > width - 1 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1 - width].id;
      revealCell(newId);
    }
    if (currentId > width) {
      const newId = cells[parseInt(currentId) - width].id;
      revealCell(newId);
    }
    if (currentId > width + 1 && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1 - width].id;
      revealCell(newId);
    }
    if (currentId > width * width - 2 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1].id;
      revealCell(newId);
    }
    if (currentId < width * width - width && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1 + width].id;
      revealCell(newId);
    }
    if (currentId < width * width - width - 2 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1 + width].id;
      revealCell(newId);
    }
    if (currentId < width * width - width - 1) {
      const newId = cells[parseInt(currentId) + width].id;
      revealCell(newId);
    }
  }, 10);
};

const checkForWin = () => {
  if (minesLeft === 0) {
    smile.classList.add("smile-win");
    clearInterval(secondsTimer);
    isGameOver = true;
  }
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const createMap = () => {
  const minesCells = Array(mines).fill("mine");
  const emptyCells = Array(width * width - mines).fill("valid");
  const mapCells = emptyCells.concat(minesCells);
  shuffle(mapCells);

  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    cell.setAttribute("id", "cell-" + i);
    cell.classList.add("default");
    cell.classList.add(mapCells[i]);
    gameBoard.appendChild(cell);
    cells.push(cell);

    cell.addEventListener("click", () => revealCell(cell.id));
    cell.addEventListener("mousedown", () => smile.classList.add("smile-shocked"));
    cell.addEventListener("mouseup", () => smile.classList.remove("smile-shocked"));
    cell.oncontextmenu = (e) => {
      e.preventDefault();
      toggleCellMark(cell);
    };
  }

  for (let i = 0; i < cells.length; i++) {
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;
    let total = 0;

    if (cells[i].classList.contains("valid")) {
      if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains("mine")) {
        total++;
      }
      if (
        i > width - 1 &&
        !isRightEdge &&
        cells[i + 1 - width].classList.contains("mine")
      ) {
        total++;
      }
      if (i > width && cells[i - width].classList.contains("mine")) {
        total++;
      }
      if (
        i > width + 1 &&
        !isLeftEdge &&
        cells[i - 1 - width].classList.contains("mine")
      ) {
        total++;
      }
      if (
        i < width * width - 2 &&
        !isRightEdge &&
        cells[i + 1].classList.contains("mine")
      ) {
        total++;
      }
      if (
        i < width * width - width &&
        !isLeftEdge &&
        cells[i - 1 + width].classList.contains("mine")
      ) {
        total++;
      }
      if (
        i < width * width - width - 2 &&
        !isRightEdge &&
        cells[i + 1 + width].classList.contains("mine")
      ) {
        total++;
      }
      if (i < width * width - width - 1 && cells[i + width].classList.contains("mine")) {
        total++;
      }
      cells[i].setAttribute("data", total);
    }
  }
};

export const startGame = (mapWidth, minesAmount) => {
  width = mapWidth;
  mines = minesAmount;
  minesLeft = minesAmount;
  createMap();
  smile.addEventListener("click", restartGame);
  smile.addEventListener("mousedown", () => smile.classList.add("smile-mousedown"));
  smile.addEventListener("mouseup", () => smile.classList.remove("smile-mousedown"));
};
