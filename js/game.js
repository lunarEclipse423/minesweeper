const gameBoard = document.querySelector(".game-body");
const smile = document.querySelector(".smile");
let secondsTimer, minutesTimer;
let flags = 0;
let cells = [];
let isGameOver = false;
let isFirstClick = true;
let duration;
let width;
let mines;

const gameOver = () => {
  isGameOver = true;
  smile.classList.add("smile-game-over");
  clearInterval(secondsTimer);
  clearInterval(minutesTimer);
  cells.forEach((cell) => {
    if (cell.classList.contains("mine")) {
      cell.classList.add("checked");
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

const startGameTimer = (duration) => {
  const minutesClock = document.querySelectorAll(".max-time .digit");
  const start = Date.now();
  let diff;
  let minutes = 0;

  const minutesTimer = setInterval(() => {
    diff = duration - (((Date.now() - start) / 1000) | 0);
    if (diff >= duration) {
      gameOver();
      clearInterval(minutesTimer);
      return;
    }
    minutes = (diff / 60) | 0;
    minutes =
      minutes < 10 ? "00" + minutes : minutes < 100 ? "0" + minutes : "" + minutes;

    for (let i = 0; i < minutes.length; i++) {
      displayDigit(minutesClock[i], minutes[i], "descending");
    }
  }, 1000);

  const secondsClock = document.querySelectorAll(".current-time .digit");
  let seconds = 0;

  const secondsTimer = setInterval(() => {
    if (seconds >= duration) {
      gameOver();
      clearInterval(secondsTimer);
      return;
    }
    seconds += 1;
    const secondsText =
      seconds < 10 ? "00" + seconds : seconds < 100 ? "0" + seconds : "" + seconds;
    for (let i = 0; i < secondsText.length; i++) {
      displayDigit(secondsClock[i], secondsText[i], "ascending");
    }
  }, 1000);

  return { secondsTimer, minutesTimer };
};

const restartGame = () => {
  clearInterval(secondsTimer);
  clearInterval(minutesTimer);
  let maxTime = document.querySelectorAll(".max-time .digit");
  let currenTime = document.querySelectorAll(".current-time .digit");

  for (let i = 0; i < maxTime.length; i++) {
    maxTime[i].className = `max-time digit ${i === 1 ? "digit-four" : "digit-zero"}`;
    currenTime[i].className = "current-time digit digit-zero";
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
      const timers = startGameTimer(duration);
      secondsTimer = timers.secondsTimer;
      minutesTimer = timers.minutesTimer;
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
      checkForWin();
    } else if (cell.classList.contains("flag")) {
      cell.classList.add("question");
      cell.classList.remove("flag");
      flags--;
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
  let correctlyMarkedMines = 0;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].classList.contains("flag") && cells[i].classList.contains("mine")) {
      correctlyMarkedMines++;
    }
    if (correctlyMarkedMines === mines) {
      smile.classList.add("smile-win");
      clearInterval(secondsTimer);
      clearInterval(minutesTimer);
      isGameOver = true;
    }
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

export const startGame = (mapWidth, minesAmount, gameDuration) => {
  duration = gameDuration;
  width = mapWidth;
  mines = minesAmount;
  createMap();
  smile.addEventListener("click", restartGame);
  smile.addEventListener("mousedown", () => smile.classList.add("smile-mousedown"));
  smile.addEventListener("mouseup", () => smile.classList.remove("smile-mousedown"));
};
