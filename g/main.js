import {
    Game
} from "./Game/Game.js";
import {
    Vector
} from "./Game/Vector.js";
import {
    Drawable
} from "./Game/Drawable.js";

const g = new Game(document.querySelector("canvas"));
window.g = g; // Allow debuging from the console.

g.loadImage("grass-tile", "./Images/grass-tile.png");

class GrassTile extends Drawable {
    constructor(pos) {
        super(pos, 32, 32);
        this.image = g.image("grass-tile");
    }

    draw(context, timestamp) {
        context.drawImage(this.image, this.pos.x, this.pos.y);
    }

}

g.level.fill(0, Vector.Zero, 10, 10, GrassTile, 32, 32);

g.start();