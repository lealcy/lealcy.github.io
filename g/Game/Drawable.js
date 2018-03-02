import {
    Vector
} from "./Vector.js";

export class Drawable {
    constructor(pos = Vector.Zero, width = 32, height = 32) {
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    draw(context, timestamp) {
        context.save();
        context.fillStyle = "magenta";
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        context.restore();
    }
}