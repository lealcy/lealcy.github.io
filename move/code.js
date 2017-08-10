"use strict";

const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const tank = new Image();
tank.src = "tank.png";

let keys = {};
body.addEventListener("keydown", (e) => keys[e.key] = true, false);
body.addEventListener("keyup", (e) => keys[e.key] = false, false);

class Vehicle {
    constructor(x, y, sprite, scale) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.angle = 0;
        this.scale = scale;
    }

    update() {
        if (keys.ArrowRight === true) {
            this.angle += keys.ArrowDown === true ? -0.03 : 0.06;
        }
        if (keys.ArrowLeft === true) {
            this.angle += keys.ArrowDown === true ? 0.03 : -0.06;
        }
        if (keys.ArrowUp === true) {
            this.x += 3 * Math.cos(this.angle);
            this.y += 3 * Math.sin(this.angle);
        }
        if (keys.ArrowDown === true) {
            this.x += -2 * Math.cos(this.angle);
            this.y += -2 * Math.sin(this.angle);
        }

    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -this.sprite.width * this.scale / 2, -this.sprite.height * this.scale / 2,
            this.sprite.width * this.scale,
            this.sprite.height * this.scale);
        ctx.restore();
    }
}

const vehicle = new Vehicle(canvas.width / 2, canvas.height / 2, tank, 0.3);

function start() {
    window.requestAnimationFrame(update);

}

function update() {
    window.requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    vehicle.update();
    vehicle.draw();
}

start();