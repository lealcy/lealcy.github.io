"use strict";

const screen = document.getElementById("screen");
const context = screen.getContext("2d", { alpha: false });

class Point {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius;
    }

    draw(context) {
        context.fillStyle = "blue";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

const points = [];

function start() {
    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    points.forEach(point => point.draw());
}

start();
