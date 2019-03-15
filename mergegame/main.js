"use strict";

class Game {
    constructor(boardElement) {
        this.spawnBlockInterval = 3000;
        this.incomeInterval = 5000;
        this.incomeMultipler = 1.15;
        this.baseBlockValue = 1;
        this.money = 0;
        this.imageFiles = [null, "stone", "stoneBrick", "stoneFurnace", "coal", "burnerMiningDrill", "iron", "ironPlate", "ironGear", "copper", "copperPlate", "copperCable", "pipe", "water", "waterPump", "boiler", "steam", "steamTurbine", "steamEngine", "electricity", "assembler1", "concrete", "electricMiner", "electricFurnace", "steelPlate", "steelFurnace", "oilPump", "petroleum", "assembler2", "refinery", "heavyOil", "lightOil", "naturalGas", "chemicalPlant", "sulfur", "sulfuricAcid", "lubricant", "solidFuel", "plastic", "assembler3", "electronicCircuit", "microprocessor", "processingUnit", "lowDensityPlate", "launchpad", "rocketFuel", "engine", "battery", "batteryPack", "flightComputer", "acceleratorModule", "radar", "spacecraftModule"];
        this.preloadImages();
        this.board = new Board(this, boardElement);
    }

    getBlockImageSrc(value) {
        if (value >= this.imageFiles.length) {
            value = this.imageFiles.length - 1;
        }
        return `images/${this.imageFiles[value]}.png`;
    }

    formatNumber(num, digits) {

        const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        let decimal;
        for (let i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);
            if (num <= -decimal || num >= decimal) {
                return +(num / decimal).toFixed(digits) + units[i];
            }
        }
        return num.toFixed(digits);
    }

    preloadImages() {
        this.imageFiles.forEach((image, i) => {
            if (image == null) {
                return;
            }
            const link = document.createElement("link");
            link.href = this.getBlockImageSrc(i);
            link.rel = "preload";
            link.as = "image";
            document.head.appendChild(link);
        });
    }
}

class Board {
    constructor(game, boardElement) {
        this.game = game;
        this.boardElement = boardElement;
        this.selectedBlock = null;
        this.initializeBlocks();
        this.prefetchImages();
        this.spawnBlock();
        this.generateIncome();
    }

    initializeBlocks() {
        this.blocks = [];
        Array.from(this.boardElement.querySelectorAll(".block")).forEach(element => {
            const block = new Block(this.game, element);
            this.blocks[block.id] = block;
            element.addEventListener("mouseup", e => this.blockClickedEvent(e, block), false);
        });
    }

    spawnBlock() {
        setTimeout(this.spawnBlock.bind(this), this.game.spawnBlockInterval);
        for (const block of this.blocks) {
            if (block.value === 0) {
                block.value = this.game.baseBlockValue;
                break;
            }
        }
    }

    generateIncome() {
        setTimeout(this.generateIncome.bind(this), this.game.incomeInterval);
        for (const block of this.blocks) {
            if (block.value !== 0) {
                const income = block.value === 1 ? block.value : block.value * this.game.incomeMultipler;
                this.game.money += income;
                block.innerElement.textContent = `$${this.game.formatNumber(income, 2)}`;
                block.innerElement.classList.remove("fadeOutAnimation");
                setTimeout(() => block.innerElement.classList.add("fadeOutAnimation"), 1);
            }
        }

    }

    blockClickedEvent(e, block) {
        if (block.value === 0) {
            if (this.selectedBlock !== null) {
                block.value = this.selectedBlock.value;
                this.selectedBlock.value = 0;
                this.select(block);
            }
        } else {
            if (this.selectedBlock === null) {
                this.select(block);
            } else if (this.selectedBlock === block) {
                this.deselectAll();
            } else if (block.value === this.selectedBlock.value) {
                block.value++;
                this.selectedBlock.value = 0;
                this.select(block);
            } else {
                this.select(block);
            }
        }
    }

    deselectAll() {
        this.selectedBlock = null;
        this.blocks.forEach(block => block.deselect());
    }

    select(block) {
        this.deselectAll();
        this.selectedBlock = block;
        block.select();
    }

    clear() {
        this.blocks.forEach(block => block.value = 0);
    }

    prefetchImages() {
        let j;
        this.game.imageFiles.forEach((image, i) => {
            setTimeout(() => this.blocks[i % this.blocks.length].setImage(i), i * 5);
            j = i;
        });
        setTimeout(() => this.clear(), j * 5 + 5);
    }

}

class Block {
    constructor(game, blockElement) {
        this.game = game;
        this.blockElement = blockElement;
        this.innerElement = blockElement.querySelector("span");
        this.value = 0;
    }
    get id() {
        return this.blockElement.dataset.id;
    }

    get value() {
        return parseInt(this.blockElement.dataset.value);
    }

    set value(value) {
        this.blockElement.dataset.value = value;
        this.setImage(value);
    }

    setImage(value) {
        this.blockElement.style.backgroundImage = value === 0 ? "none" : `url("${this.game.getBlockImageSrc(value)}")`;
    }

    select() {
        this.blockElement.classList.add("selected");
    }

    deselect() {
        this.blockElement.classList.remove("selected");

    }
}

const game = new Game(document.getElementById("board"));

/*const rows = 6;
const columns = 4;
const board = new Uint8Array(rows * columns);
const perfectFrameTime = 1000 / 60;
const images = [];
let frameTime = 0;
let deltaTime = 0;
let lastTimestamp = 0;
let frames = 0;
let selected = null;
let lastSpawnTime = 0;
let currentMoneyFadeTime = 0;
let lastMoneyGenerateTime = 0;
let moneyGenerateTime = 5000;
let moneyFadeTime = 1000;
let money = 0;
let baseLevel = 1;
let baseLevelIncrementMultiplier = 2.2;
let currentLevelUpgradeCost = 128;
let currentSpawnUpgradeCost = 180;
let spawnTime = 3000;
let spawnTimeDecrement = 100;
let spawnDecrementMultiplier = 6;

function start() {
    return;
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
                board[i] = baseLevel;
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
    drawUpgradeButtons();
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
            drawBlock(px, py, blockWidth, blockHeight, board[id] === 0 ? "#333333" : "#444444");
            if (board[id] !== 0) {
                ctx.drawImage(images[board[id]], px, py, blockWidth, blockHeight);
            }
            if (board[id] && currentMoneyFadeTime > 0) {
                ctx.globalAlpha = currentMoneyFadeTime / moneyFadeTime;
                drawText(px + (blockWidth / 2), py + (blockHeight / 2) + (15 / 4), 18, `$${formatNumber(moneyFor(id), 2)}`, true);
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
    drawText(canvas.width / 2, rows * (blockHeight + 1) + 35 / 2, 25, `Money: $${formatNumber(money, 2)}`, true);
}

function drawUpgradeButtons() {
    const y = rows * blockHeight + 28;

    drawBlock(0, y, canvas.width / 2, canvas.height, money >= currentLevelUpgradeCost ? "#555555" : "#333333");
    drawText(canvas.width / 4, y + 26, 16, `Level: ${baseLevel + 1}`, true);
    drawText(canvas.width / 4, y + 56, 18, `$${formatNumber(currentLevelUpgradeCost, 2)}`, true);

    drawBlock(canvas.width / 2, y, canvas.width / 2, canvas.height, money >= currentSpawnUpgradeCost ? "#555555" : "#333333");
    drawText(canvas.width / 4 * 3, y + 26, 16, `Interval: ${(spawnTime - spawnTimeDecrement) / 1000}s`, true);
    drawText(canvas.width / 4 * 3, y + 56, 18, `$${formatNumber(currentSpawnUpgradeCost, 2)}`, true);
}

function drawBlock(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
}

function drawText(x, y, size, text, centered = false) {
    ctx.font = `bold ${size}px 'Verdana'`;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    if (centered) {
        const textMetrics = ctx.measureText(text);
        x -= textMetrics.width / 2;
    }
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);

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
            selected = {
                x,
                y
            };
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

start();*/