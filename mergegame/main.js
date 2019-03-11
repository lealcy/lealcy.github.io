"use strict";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", {
    alpha: false
});

const rows = 6;
const columns = 4;
const board = new Uint8Array(rows * columns);
const blockWidth = canvas.width / columns;
const blockHeight = blockWidth;
const perfectFrameTime = 1000 / 60;
const images = [];
let frameTime = 0;
let deltaTime = 0;
let lastTimestamp = 0;
let frames = 0;
let selected = null;
let spawnTime = 3000;
let lastSpawnTime = 0;
let currentMoneyFadeTime = 0;
let lastMoneyGenerateTime = 0;
let moneyGenerateTime = 5000;
let moneyFadeTime = 1000;
let money = 0;

function start() {
    requestAnimationFrame(update);
    ctx.imageSmoothingEnabled = false;
    loadImages();
    canvas.addEventListener("mouseup", click, false);
}

function update(timestamp) {
    requestAnimationFrame(update);
    frameTime = timestamp - lastTimestamp;
    deltaTime = frameTime / perfectFrameTime;
    lastTimestamp = timestamp;
    frames++;
    if (timestamp >= lastSpawnTime + spawnTime) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                board[i]++;
                break;
            }
        }
        lastSpawnTime = timestamp;
    }
    if (timestamp >= lastMoneyGenerateTime + moneyGenerateTime) {
        lastMoneyGenerateTime = timestamp;
        generateMoney();
        currentMoneyFadeTime = moneyFadeTime;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawMoney();
    if (currentMoneyFadeTime > 0) {
        currentMoneyFadeTime -= frameTime;
    }
}

function drawBoard() {
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const id = y * columns + x;
            const px = x * blockWidth;
            const py = y * blockHeight;
            ctx.fillStyle = "#333333";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillRect(px, py, blockWidth, blockHeight);
            ctx.strokeRect(px, py, blockWidth, blockHeight);
            if (board[id] !== 0) {
                ctx.drawImage(images[board[id]], px, py, blockWidth, blockHeight);
            }
            if (board[id] && currentMoneyFadeTime > 0) {
                ctx.font = "bold 18px 'Verdana'";
                ctx.globalAlpha = currentMoneyFadeTime / moneyFadeTime;
                ctx.lineWidth = 0.5;
                ctx.fillStyle = "white";
                const text = `$${formatNumber(moneyFor(id), 2)}`;
                const textMetrics = ctx.measureText(text);
                const textX = px + (blockWidth / 2) - (textMetrics.width / 2);
                const textY = py + (blockHeight / 2) + (15 / 4);
                ctx.fillText(text, textX, textY);
                ctx.strokeText(text, textX, textY);
                ctx.globalAlpha = 1;
            }

        }
    }
    if (selected) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(selected.x * blockWidth, selected.y * blockHeight, blockWidth, blockHeight);
    }

}

function drawMoney() {
    ctx.font = "bold 25px 'Verdana'";
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    const text = `Money: $${formatNumber(money, 2)}`;
    const textMetrics = ctx.measureText(text);
    const textX = canvas.width / 2 - textMetrics.width / 2;
    const textY = rows * (blockHeight + 1) + 35 / 2;
    ctx.fillText(text, textX, textY);
    ctx.strokeText(text, textX, textY);

}

function generateMoney() {
    board.forEach((v, i) => money += moneyFor(i));
}

function moneyFor(i) {
    const base = board[i];
    return base * (base % 2 === 0 ? 1.1 : 1);
}

function click(e) {
    const x = Math.floor(e.offsetX / blockWidth);
    const y = Math.floor(e.offsetY / blockHeight);
    if (x < 0 || x >= columns || y < 0 || y >= rows) {
        return;
    }
    const id = y * columns + x;
    if (selected === null) {
        if (board[id] !== 0) {
            selected = {
                x,
                y
            };
        }
    } else {
        const selectedId = selected.y * columns + selected.x;
        if (id === selectedId) {
            selected = null;
        } else if (board[id] === board[selectedId]) {
            board[id]++;
            board[selectedId] = 0;
            selected = null;
        } else if (board[id] === 0) {
            board[id] = board[selectedId];
            board[selectedId] = 0;
            selected = null;
        } else if (board[id] !== 0) {
            selected = {
                x,
                y
            };
        } else {
            selected = null;
        }
    }
}

function loadImages() {
    imageFiles.forEach(v => {
        if (v === null) {
            images.push("empty");
            return;
        }
        const img = new Image();
        img.onload = () => console.log(`Image "${v}" loaded.`);
        img.src = `images/${v}.png`;
        images.push(img);
    })
}

function formatNumber(num, digits) {
    let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let decimal;
    for (let i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);
        if (num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }
    return num.toFixed(digits);
}

const imageFiles = [null, "stone", "stoneBrick", "stoneFurnace", "coal", "burnerMiningDrill", "iron", "ironPlate", "ironGear", "copper", "copperPlate", "copperCable", "pipe", "water", "waterPump", "boiler", "steam", "steamTurbine", "steamEngine", "electricity", "assembler1", "concrete", "electricMiner", "electricFurnace", "steelPlate", "steelFurnace", "oilPump", "petroleum", "assembler2", "refinery", "heavyOil", "lightOil", "naturalGas", "chemicalPlant", "sulfur", "sulfuricAcid", "lubricant", "solidFuel", "plastic", "assembler3", "electronicCircuit", "microprocessor", "processingUnit", "lowDensityPlate", "launchpad", "rocketFuel", "engine", "battery", "batteryPack", "flightComputer", "acceleratorModule", "radar", "spacecraftModule"];

start();