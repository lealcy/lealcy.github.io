import Game from "./Game.js";

document.getElementById("disclaimer").addEventListener("click", function () {
    this.remove();
});

const game = new Game();

game.run();
