"use strict";

const COLS = 20;
const ROWS = 20;
const BOMB_CHANCE = 0.15;
const EMPTY = "";
const FLAG = "🚩";
const BOMB = "💣";
const TEXT_COLORS = [
    "0",
    "GREEN",
    "BLUE",
    "RED",
    "PURPLE",
    "MAGENTA",
    "BLACK",
    "BLACK",
    "BLACK",
];

class Playfield {

    constructor() {
        this.el = document.getElementById("playfield");
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const btn = document.createElement("button");
                btn.id = `btn_${x}_${y}`;
                btn.classList.add("btn");
                btn.dataset.x = x;
                btn.dataset.y = y;
                btn.addEventListener("click", this.btnClick.bind(this), false);
                btn.addEventListener("contextmenu", this.btnRightClick.bind(this), false);
                this.el.appendChild(btn);
            }
        }
        this.reset();
    }

    reset() {
        console.log("reset");
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const btnId = `btn_${x}_${y}`;
                const btn = document.getElementById(btnId);
                btn.dataset.flagged = false;
                btn.dataset.isBomb = Math.random() < BOMB_CHANCE;
                btn.dataset.bombCount = 0;
                btn.dataset.marked = false;
                btn.textContent = EMPTY;
                btn.disabled = false;
            }
        }

    }

    countBombs(btn) {
        const x = parseInt(btn.dataset.x);
        const y = parseInt(btn.dataset.y);
        let count = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i === x && j === y) && i >= 0 && i < COLS && j >= 0 && j < ROWS) {
                    const btn = document.getElementById(`btn_${i}_${j}`);
                    if (btn.dataset.isBomb === "true") {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    reveal() {
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const btnId = `btn_${x}_${y}`;
                this.btnClick({ target: document.getElementById(btnId) }, true);
            }
        }
    }

    markEmptyNeighbors(btn) {
        const x = parseInt(btn.dataset.x);
        const y = parseInt(btn.dataset.y);

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i === x && j === y) && i >= 0 && i < COLS && j >= 0 && j < ROWS) {
                    const neighbor = document.getElementById(`btn_${i}_${j}`);
                    if (neighbor.dataset.marked !== "true") {
                        const bombCount = this.countBombs(neighbor);
                        if (bombCount === 0) {
                            this.btnClick({ target: neighbor });
                        }
                    }
                }
            }
        }
    }
    btnClick(evt, revealing = false) {
        const btn = evt.target;
        btn.disabled = true;
        if (btn.dataset.isBomb === "true") {
            btn.textContent = BOMB;
            if (!revealing) {
                this.reveal();
            }
            // GAME OVER MAN
            return;
        }
        if (btn.dataset.marked === "false") {
            btn.dataset.marked = true;
            const bombCount = this.countBombs(btn);
            btn.dataset.bombCount = bombCount;
            if (bombCount > 0) {
                btn.textContent = bombCount;
                btn.style.color = TEXT_COLORS[bombCount];
            } else {
                this.markEmptyNeighbors(btn);
            }
        }
    }

    btnRightClick(evt) {
        evt.preventDefault();
        const btn = evt.target;
        if (btn.dataset.bombCount !== "0") {
            return;
        }
        if (btn.dataset.flagged === "false") {
            btn.dataset.flagged = true;
            btn.textContent = FLAG;
        } else {
            btn.dataset.flagged = false;
            btn.textContent = EMPTY;
        }
    }
}

const playfield = new Playfield();

const btnNew = document.getElementById("newGame");
btnNew.addEventListener("click", e => playfield.reset(), false);