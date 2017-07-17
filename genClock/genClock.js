"use strict";

let canvas = document.getElementById("canvas");
let cWidth = canvas.width;
let cHeight = canvas.height;
let ctx = canvas.getContext("2d");
let stop = false;
let populationSize = 1000;
let aptGroupSize = Math.floor(populationSize / 2);
let mutationChance = 0.005;
let boardWidth = 27;
let boardHeight = 5;
let boardSize = boardWidth * boardHeight;
let blockWidth = cWidth / boardWidth;
let blockHeight = cHeight / boardHeight / 4;
let bg = [255, 255, 255];
let fg = [0, 0, 0];
let minTint = 0;
let maxTint = 256;
let spacer = [bg, bg, bg, bg, bg];
let colon = [ bg, fg, bg, fg, bg];
let digits = [
    [   
        fg, fg, fg, fg, fg,
        fg, bg, bg, bg, fg,
        fg, fg, fg, fg, fg, 
    ],
    [
        bg, bg, bg, bg, bg,
        fg, fg, fg, fg, fg,
        bg, bg, bg, bg, bg,
    ],
    [
        fg, bg, fg, fg, fg,
        fg, bg, fg, bg, fg,
        fg, fg, fg, bg, fg,
    ],
    [
        fg, bg, fg, bg, fg,
        fg, bg, fg, bg, fg,
        fg, fg, fg, fg, fg,
    ],
    [
        fg, fg, fg, bg, bg,
        bg, bg, fg, bg, bg,
        fg, fg, fg, fg, fg,
    ],
    [
        fg, fg, fg, bg, fg,
        fg, bg, fg, bg, fg,
        fg, bg, fg, fg, fg,
    ],
    [
        fg, fg, fg, fg, fg,
        fg, bg, fg, bg, fg,
        fg, bg, fg, fg, fg,
    ],
    [
        fg, bg, bg, bg, bg,
        fg, bg, bg, bg, bg,
        fg, fg, fg, fg, fg,
    ],
    [
        fg, fg, fg, fg, fg,
        fg, bg, fg, bg, fg,
        fg, fg, fg, fg, fg,
    ],
    [
        fg, fg, fg, bg, fg,
        fg, bg, fg, bg, fg,
        fg, fg, fg, fg, fg,
    ]
];
let clockBoard = [];
updateClockBoard();
let population = randomPopulation();

function drawBlock(color, x, y) {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(x, y, blockWidth, blockHeight);
}

function drawBoard(boardData, x, y) {
    for (let bx = 0; bx < boardWidth; bx++) {
        for (let by = 0; by < boardHeight; by++) {
            drawBlock(boardData[bx * boardHeight + by], bx * blockWidth + x, by * blockHeight + y);            
        }
    }
}

function updateClockBoard() {
    let time = new Date().toLocaleTimeString();
    clockBoard = [].concat(digits[time[0]]);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(digits[time[1]]);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(colon);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(digits[time[3]]);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(digits[time[4]]);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(colon);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(digits[time[6]]);
    clockBoard = clockBoard.concat(spacer);
    clockBoard = clockBoard.concat(digits[time[7]]);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return [
        randInt(minTint, maxTint), 
        randInt(minTint, maxTint), 
        randInt(minTint, maxTint)
    ];
}

function randomGenome() {
    let genome = [];
    for (let i = 0; i < boardSize; i++) {
        genome.push(randomColor());
    }
    return genome;
}

function randomPopulation() {
    let pop = [];
    for (let ps = 0; ps < populationSize; ps++) {
        pop.push(randomGenome());
    }
    pop.sort(weight);
    return pop;
}

function weight(gen1, gen2) {
    return fitness(gen1) - fitness(gen2);
}

function fitness(gen) {
    let score = 0;
    for (let i = 0; i < boardSize; i++) {
        score += Math.abs(gen[i][0] - clockBoard[i][0]);
        score += Math.abs(gen[i][1] - clockBoard[i][1]);
        score += Math.abs(gen[i][2] - clockBoard[i][2]);
    }
    return score;
}

function breed(gen1, gen2) {
    let newGen = [];
    for (let i = 0; i < boardSize; i++) {
        if (Math.random() < mutationChance){
            newGen.push(randomColor());
        } else {
            newGen.push(Math.round(Math.random()) ? gen2[i] : gen1[i]);
        }
    }
    return newGen;
}

function evolve() {
    var newPop = []; 
    for (var ps = 0; ps < populationSize; ps++) {
        let gen1 = population[randInt(0, aptGroupSize)];
        let gen2 = population[randInt(0, aptGroupSize)];
        newPop.push(breed(gen1, gen2));
    }
    population = newPop.sort(weight);
}

function tick() {
    if (stop) { 
        return;
    }
    window.requestAnimationFrame(tick);
    updateClockBoard();
    //drawBoard(clockBoard, 0, 10);
    drawBoard(population[0], 0, 10);
    drawBoard(population[populationSize / 2], 0, 190);
    drawBoard(population[populationSize - 1], 0, 370);
    evolve();
}


function start() {
    stop = false;
    window.requestAnimationFrame(tick);
}

