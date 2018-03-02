import {
    Level
} from "./Level.js";
import {
    Camera
} from "./Camera.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d", {
            alpha: false
        });
        this.level = new Level(this);
        this.camera = new Camera(this);
        this.images = new Map;
    }

    start() {
        requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        requestAnimationFrame(this.update.bind(this));
        this.camera.update(timestamp);
    }

    loadImage(name, src) {
        const img = new Image();
        img.src = src;
        this.images.set(name, img);
        return this;
    }

    image(name) {
        return this.images.get(name);
    }
}