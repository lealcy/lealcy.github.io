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

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

let mode = MODE_NONE;
let tb = new TileBoard();

function start() {
    loadImages(images, ctx, update);
}

function mouseDown(e) {
    mode = e.button;
    if (mode == MODE_DRAW) {
        tb.add(new Wall(Math.floor(e.offsetX / TILE_WIDTH), Math.floor(e.offsetY / TILE_HEIGHT)));
    }
}

function mouseUp(e) {
    mode = MODE_NONE;
}

function mouseMove(e) {
    if (mode === MODE_DRAW) {
        tb.add(new Wall(Math.floor(e.offsetX / TILE_WIDTH), Math.floor(e.offsetY / TILE_HEIGHT)));
    }
}

function update() {
    window.requestAnimationFrame(update);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tb.update(ctx);
}

start();