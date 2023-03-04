import { startGame } from "./game.js";

const mapWidth = 16;
const minesAmount = 40;

document.addEventListener("DOMContentLoaded", () => {
  startGame(mapWidth, minesAmount);
});
