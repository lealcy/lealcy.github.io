"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const blockWidth = 32;
const blockHeight = 32;
const boardWidth = 32;
const boardHeight = 16;
const fallSpeed = 10;


const colors = new Set;
["blue", "green", "red", "yellow"].forEach(c => {
    const img = new Image();
    img.src = `${c}.png`;
    colors.add(img);
});

canvas.width = boardWidth * blockWidth;
canvas.height = boardHeight * blockHeight;

let board = [];
let score = 0;
let basePoints = 1;
let multiplier = 1.1;

function Block(x, y, color) {
    this.absX = x * blockWidth;
    this.absY = 0;
    this.x = x;
    this.y = y;
    this.color = color;

    this.update = function () {
        if (this.absY < this.y * blockHeight) {
            this.absY += fallSpeed;
        } else {
            this.absY = this.y * blockHeight;
        }
    }

    this.draw = function () {
        //context.fillStyle = this.color;
        //context.fillRect(this.absX, this.absY, blockWidth, blockHeight);
        context.drawImage(this.color, this.absX, this.absY);
    }

}

function start() {
    requestAnimationFrame(update);
    for (let x = 0; x < boardWidth; x++) {
        board[x] = [];
        for (let y = 0; y < boardHeight; y++) {
            board[x][y] = null;
        }
    }
    canvas.addEventListener("mouseup", click, false);
}

function update(timestamp) {
    requestAnimationFrame(update);
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight; y++) {
            if (!board[x][y]) {
                continue;
            }
            board[x][y].update();
            board[x][y].draw();
        }
    }
    context.fillStyle = "black";
    context.fillText(Math.floor(score), 11, 21);
    context.fillStyle = "white";
    context.fillText(Math.floor(score), 10, 20);
    fallBlocks();
}

function getRandomColor() {
    return Array.from(colors)[Math.floor(Math.random() * colors.size)];
}

function fallBlocks() {
    for (let x = 0; x < boardWidth; x++) {
        if (board[x][0] === null) {
            board[x][0] = new Block(x, 0, getRandomColor());
        }
    }

    for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight - 1; y++) {
            if (board[x][y + 1] == null) {
                board[x][y + 1] = board[x][y];
                board[x][y] = null;
                board[x][y + 1].y = y + 1;
            }
        }
    }
    /*
        for (let i = boardWidth - 1; i > 0; i--) {
            for (let j = 0; j < boardHeight; j++) {
                if (!board[i][j] && board[i - 1][j]) {
                    board[i][j] = board[i - 1][j]
                    board[i - 1][j] = null;
                    board[i][j].x = j;
                    board[i][j].y = i;
                }
            }
        }
        for (let j = 0; j < boardWidth; j++) {
            if (!board[0][j]) {
                board[0][j] = new Block(0, j, getRandomColor());
            }
        }*/
}

function click(e) {
    removeBlock(Math.floor(e.offsetX / blockWidth), Math.floor(e.offsetY / blockHeight));
}

function removeBlock(x, y) {
    console.log("clicked block at", x, y);
    const color = board[x][y].color;
    const up = y > 0 ? board[x][y - 1] : null,
        right = x < boardWidth - 1 ? board[x + 1][y] : null,
        down = y < boardHeight - 1 ? board[x][y + 1] : null,
        left = x > 0 ? board[x - 1][y] : null;
    if (!((up && up.color === color) || (right && right.color === color) || (down && down.color === color) || (left && left.color === color))) {
        return;
    }
    console.log("Remove root block", x, y, color)
    board[x][y] = null;
    score += basePoints;
    removeBlockAdjacent(x, y - 1, color, basePoints);
    removeBlockAdjacent(x + 1, y, color, basePoints);
    removeBlockAdjacent(x, y + 1, color, basePoints);
    removeBlockAdjacent(x - 1, y, color, basePoints);
}

function removeBlockAdjacent(x, y, color, points) {
    if (x < 0 || x > boardWidth - 1 || y < 0 || y > boardHeight - 1) {
        return;
    }
    const block = board[x][y];
    if (!block || block.color !== color) {
        return;
    }
    console.log("Remove block", x, y, color)
    board[x][y] = null;
    score += points * multiplier;
    removeBlockAdjacent(x, y - 1, color, points * multiplier);
    removeBlockAdjacent(x + 1, y, color, points * multiplier);
    removeBlockAdjacent(x, y + 1, color, points * multiplier);
    removeBlockAdjacent(x - 1, y, color, points * multiplier);
}

start();