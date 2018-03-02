import {
    Vector
} from "./Vector.js";

export class Camera {
    constructor(g, pos = Vector.Zero) {
        this.g = g;
        this.pos = pos;
        this.width = g.canvas.width;
        this.height = g.canvas.height;
    }

    update(timestamp) {
        this.g.context.save();
        this.g.context.translate(this.x, this.y);
        this.g.level.layers.forEach(layer => {
            layer.forEach(drawable => {
                if (this.isDrawableVisible(drawable)) {
                    drawable.draw(this.g.context, timestamp);
                }
            });
        });
        this.g.context.restore();
    }

    isDrawableVisible(drawable) {
        return Math.max(this.pos.x, drawable.pos.x) < Math.min(this.pos.x + this.width, drawable.pos.x + drawable.width) &&
            Math.max(this.pos.y, drawable.pos.y) < Math.min(this.pos.y + this.height, drawable.pos.y + drawable.height);
    }
}

function intersect(va, vb) {
    return Math.max(ax, bx) < Math.min(ax + aw, bx + bw) &&
        Math.max(ay, by) < Math.min(ay + ah, by + bh);
}