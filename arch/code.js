"use strict";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("contextmenu", e => e.preventDefault(), false);

const MODE_NONE = -1;
const MODE_DRAW = 0;
const MODE_ERASE = 2;

const WALL_WIDTH = 32;
const WALL_HEIGHT = 32;

let mode = MODE_NONE;
let walls = [];

class Wall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x * WALL_WIDTH, this.y * WALL_HEIGHT, WALL_WIDTH, WALL_HEIGHT);
    }
}

function mouseDown(e) {
    mode = e.button;
    if (mode == MODE_DRAW) {
        drawWall(Math.floor(e.offsetX / WALL_WIDTH), Math.floor(e.offsetY / WALL_HEIGHT));
    }
}

function mouseUp(e) {
    mode = MODE_NONE;
}

function mouseMove(e) {
    if (mode === MODE_DRAW) {
        drawWall(Math.floor(e.offsetX / WALL_WIDTH), Math.floor(e.offsetY / WALL_HEIGHT));
    }
}

function drawWall(x, y) {
    for (let i = 0, j = walls.length; i < j; i++) {
        if (walls[i].x === x && walls[i].y === y) {
            // Wall already exist.
            return;
        }
    }
    walls.push(new Wall(x, y));
}

function update() {
    window.requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    walls.forEach(v => v.update());
}

update();