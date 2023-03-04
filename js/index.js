import { startGame } from "./game.js";

const mapWidth = 16;
const minesAmount = 40;
const gameDuration = 60 * 40;

document.addEventListener("DOMContentLoaded", () => {
  startGame(mapWidth, minesAmount, gameDuration);
});
