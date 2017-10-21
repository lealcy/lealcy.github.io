import Game from "./Game.js";

document.body.removeChild(document.getElementById("nomodule"));

const game = new Game(document.getElementById("buttons"));

game.run();