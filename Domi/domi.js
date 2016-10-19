"use strict";


const EMPTY = "LightCyan";
const PLAYER = "DodgerBlue";
const ENEMY = "FireBrick";
const PLAYER_DOMAIN = "DeepSkyBlue";
const ENEMY_DOMAIN = "Salmon";
const GRID_COLOR = "SlateGray";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let xOffset = 0;
let yOffset = 0;
let width = 15; // Blocks
let height = 15; // Blocks
let bWidth = canvas.height / width; // Pixels
let bHeight = canvas.height / height; // Pixels
let currentPlayer = PLAYER;

let board = [];
for (let i = 0; i < width; i++) {
    board[i] = [];
    for (let j = 0; j < height; j++) {
        board[i][j] = EMPTY;
    }
}

ctx.font = "30px Verdana";

canvas.addEventListener("mouseup", e => {
    let bX = Math.floor((e.offsetX) / bWidth);
    let bY = Math.floor((e.offsetY) / bHeight);
    if (bX >= 0 && bX < width && bY >= 0 && bY < height) {
        console.log(e.offsetX, e.offsetY, bX, bY);
        if (board[bX][bY] === EMPTY || 
            currentPlayer === PLAYER && board[bX][bY] === PLAYER_DOMAIN ||
            currentPlayer === ENEMY && board[bX][bY] === ENEMY_DOMAIN) {
            board[bX][bY] = currentPlayer;
            updateDomains();
            currentPlayer = currentPlayer === PLAYER ? ENEMY : PLAYER;    
            drawBoard();
        }
    }
});


function drawBoard() {
    ctx.save();
    ctx.fillStyle = "BurlyWood";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(xOffset, yOffset);
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 3;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.fillStyle = board[i][j];
            ctx.fillRect(i * bWidth, j * bHeight, bWidth, bHeight);
            ctx.strokeRect(i * bWidth, j * bHeight, bWidth, bHeight);
        }
    }
    ctx.restore();
    score();
}

function score() {
    let playerPoints = 0;
    let enemyPoints = 0;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (board[i][j] === PLAYER || board[i][j] === PLAYER_DOMAIN) {
                playerPoints++;
            } else if (board[i][j] === ENEMY || board[i][j] === ENEMY_DOMAIN) {
                enemyPoints++;
            }
        }
    }
    ctx.fillText(`Player1: ${playerPoints}`, canvas.height, 30);
    ctx.fillText(`Player2: ${enemyPoints}`, canvas.height, 70);

}

function updateDomains()
{
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (board[i][j] !== PLAYER && board[i][j] !== ENEMY) {
                let playerBlocks = 0;
                let enemyBlocks = 0;
                for (let x = i - 1; x <= i + 1; x++) {
                    for (let y = j - 1; y <= j + 1; y++) {
                        if (x >= 0 && y >= 0 && x < width && y < height) {
                            if(board[x][y] === PLAYER) {
                                playerBlocks++;
                            } else if (board[x][y] === ENEMY) {
                                enemyBlocks++;
                            }
                        } 
                    }
                }
                if (playerBlocks === enemyBlocks) {
                    board[i][j] = EMPTY;
                } else if (playerBlocks > enemyBlocks) {
                    board[i][j] = PLAYER_DOMAIN;
                } else {
                    board[i][j] = ENEMY_DOMAIN;
                }
            }
        }
    }
}

drawBoard();
