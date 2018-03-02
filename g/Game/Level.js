import {
    Vector
} from "./Vector.js";

export class Level {
    constructor(g) {
        this.g = g;
        this.layers = [];

    }

    fill(layer, pos, width, height, drawable, xSpace, ySpace) {
        if (!this.layers[layer]) {
            this.layers[layer] = [];
        }
        const newDrawables = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                newDrawables.push(new drawable(new Vector(pos.x + x * xSpace, pos.y + y * ySpace)));
            }
        }
        this.layers[layer].splice(0, 0, ...newDrawables);
        return newDrawables;
    }
}