"use strict";
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false,
});

const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 5;
const ADD_TILE_INTERVAL = 120; // frames

const board = [];

let tileWidth;
let tileHeight;
let imageWidth;
let slotHeight;
let mouseX = 0;
let mouseY = 0;
let grabbedTile = null;
let points = 0;
let frameCount = 0;
let stop = false;

const SLOT_IMAGE = new Image();
SLOT_IMAGE.onload = () => {
    imageWidth = SLOT_IMAGE.width;
    slotHeight = SLOT_IMAGE.height;
};
SLOT_IMAGE.src = "slotImage2.png";


function start() {
    requestAnimationFrame(update);
    canvas.addEventListener("click", e => click(e.offsetX, e.offsetY), false);
    canvas.addEventListener("mousedown", e => mouseDown(e.offsetX, e.offsetY), false);
    canvas.addEventListener("mouseup", e => mouseUp(e.offsetX, e.offsetY), false);
    canvas.addEventListener("mousemove", e => mouseMove(e.offsetX, e.offsetY), false);
    window.addEventListener("resize", adjustCanvasToPage, false);
    adjustCanvasToPage();
    fillBoard();
}

function update(timestamp) {
    if (stop) return;
    requestAnimationFrame(update);
    frameCount++;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    showScore();
    addNewTile();
}

function addNewTile() {
    if (frameCount % ADD_TILE_INTERVAL !== 0) {
        return;
    }
    const maxTries = 10;
    let x, y, tries = 0;
    do {
        x = Math.floor(Math.random() * BOARD_WIDTH);
        y = Math.floor(Math.random() * BOARD_HEIGHT);
        tries++;
        if (tries > maxTries) {
            return;
        }
    } while (board[x][y].value !== 0);
    board[x][y].value = 1;
    console.log("add tile", x, y);
}

function fillBoard() {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[x] = [];
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            board[x][y] = new Tile(x, y);
        }
    }
}

function drawBoard() {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            board[x][y].update();
        }
    }

}

function click(x, y) {
    x = Math.floor(x / tileWidth);
    y = Math.floor(y / tileHeight);
    console.log("click", x, y);
}

function mouseDown(x, y) {
    x = Math.floor(x / tileWidth);
    y = Math.floor(y / tileHeight);
    if (board[x][y].value === 0) {
        return;
    }
    grabbedTile = board[x][y];
    console.log("mouseDown", x, y);
}

function mouseUp(x, y) {
    x = Math.floor(x / tileWidth);
    y = Math.floor(y / tileHeight);
    if (!grabbedTile) {
        return;
    }
    const dropTile = board[x][y];
    if (dropTile.value === 0) {
        dropTile.value = grabbedTile.value;
        grabbedTile.value = 0;
    } else if (grabbedTile !== dropTile && grabbedTile.value === dropTile.value) {
        dropTile.value *= 2;
        grabbedTile.value = 0;
    }
    grabbedTile = null;
    console.log("mouseUp", x, y);
}

function mouseMove(x, y) {
    mouseX = x;
    mouseY = y;
    //console.log("mouseMove", x, y);
}

function showScore() {
    context.save();
    context.font = "40px 'VT323', monospace";
    context.fillStyle = "white";
    const text = points.toString();
    const textMetrics = context.measureText(text);
    context.fillText(text, canvas.width - textMetrics.width - 10, textMetrics.hangingBaseline + 10);
    context.restore();
}

function mergeSets(...sets) {
    const newSet = new Set;
    sets.forEach(set => set.forEach(item => newSet.add(item)));
    return newSet;
}

function adjustCanvasToPage() {
    const pageDimension = Math.min(document.body.offsetWidth, );
    canvas.width = document.body.offsetWidth;
    canvas.height = window.innerHeight;
    tileWidth = canvas.width / BOARD_WIDTH;
    tileHeight = canvas.height / BOARD_HEIGHT;
}

class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 0;
    }

    update() {
        if (this.value === 0) {
            return;
        }
        context.save();
        context.strokeStyle = "yellow";
        context.fillStyle = "yellow";
        const x = grabbedTile === this ? mouseX - tileWidth / 2 : this.x * tileWidth;
        const y = grabbedTile === this ? mouseY - tileHeight / 2 : this.y * tileHeight;
        context.strokeRect(x, y, tileWidth, tileHeight);
        context.font = Math.round(tileWidth / 2) + "px 'VT323', monospace";
        context.fillText(this.value, x + 10, y + tileHeight - 10);
        context.restore();
    }
}

start();