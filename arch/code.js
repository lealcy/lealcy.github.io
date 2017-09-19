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
const BOARD_WIDTH = Math.floor(canvas.width / TILE_WIDTH);
const BOARD_HEIGHT = Math.floor(canvas.height / TILE_HEIGHT);

let mode = MODE_NONE;
let tb = new TileBoard(BOARD_WIDTH, BOARD_HEIGHT);
let drawWallOutline = null;
let outlineCoords = null;

function start() {
    loadImages(images, ctx, update);
}

function mouseDown(e) {
    mode = e.button;
    let tileX = Math.floor(e.offsetX / TILE_WIDTH);
    let tileY = Math.floor(e.offsetY / TILE_HEIGHT);
    switch (mode) {
        case MODE_DRAW:
            outlineCoords = {
                bx: tileX,
                by: tileY,
                ex: tileX,
                ey: tileY
            }
            break;
        case MODE_ERASE:
            tb.removeTileAt(tileX, tileY);
    }
}

function mouseUp(e) {
    mode = MODE_NONE;
    if (outlineCoords) {
        outlineCoords.ex = Math.floor(e.offsetX / TILE_WIDTH);
        outlineCoords.ey = Math.floor(e.offsetY / TILE_HEIGHT);
        Wall.addWall(tb, outlineCoords.bx, outlineCoords.by, outlineCoords.ex, outlineCoords.ey);
        outlineCoords = null;
    }
}

function mouseMove(e) {
    if (!e.buttons) {
        mode = MODE_NONE;
        outlineCoords = null;
        return;
    }
    let tileX = Math.floor(e.offsetX / TILE_WIDTH);
    let tileY = Math.floor(e.offsetY / TILE_HEIGHT);
    switch (mode) {
        case MODE_DRAW:
            if (outlineCoords) {
                outlineCoords.ex = Math.floor(tileX);
                outlineCoords.ey = Math.floor(tileY);
            }
            break;
        case MODE_ERASE:
            tb.removeTileAt(tileX, tileY);
    }
}

function update() {
    window.requestAnimationFrame(update);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tb.update(ctx);
    if (outlineCoords) {
        drawOutline(ctx, outlineCoords.bx, outlineCoords.by, outlineCoords.ex, outlineCoords.ey);
    }
}

function maze() {
    // Fill the board with walls
    tb.clear();
    let wall;
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            wall = new Wall(x, y);
            tb.add(wall);
        }
    }
    let walls = [];
    let tile = tb.getRandomTile();
    tb.add(new Tile(tile.x, tile.y));
    walls = walls.concat(Object.values(tb.getNeighbours(tile.x, tile.y)).filter(v => v));
    let wallIndex, neighbourWalls;
    while (walls.length) {
        if (walls.length > 1000) {
            console.error("too many walls.");
            break;
        }
        wallIndex = Math.floor(Math.random() * walls.length);
        wall = walls[wallIndex];
        neighbourWalls = Object.values(tb.getNeighbours(wall.x, wall.y)).filter(v => v && v.type === "wall");
        if (neighbourWalls.length !== 2) {
            tb.add(new Tile(wall.x, wall.y));
            walls = walls.concat(neighbourWalls);
        }
        walls = walls.filter(v => v && v !== wall);
    }
}

start();