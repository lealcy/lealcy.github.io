import Game from "./Game.js";

const game = new Game(
    document.getElementById("buttons"),
    document.getElementById("resources")
);

game.run();