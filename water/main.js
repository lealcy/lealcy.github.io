"use strict";

const canvas = document.querySelector("canvas");
const SCALE = 10;
const WIDTH = Math.floor(canvas.width / SCALE);
const HEIGHT = Math.floor(canvas.height / SCALE);
const context = canvas.getContext("2d");
context.scale(SCALE, SCALE);
context.imageSmoothingEnabled = false;

class State {
    constructor() {
        this.state = this._createEmptyState();
    }

    get(x, y) {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
            return 0;
        }
        return this.state[x][y];
    }

    set(x, y, value) {
        this.state[x][y] = value;
    }

    iterate(offset = 0, limit = WIDTH) {
        const newState = this._createEmptyState();
        for (let x = offset; x < limit; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                const livingNeighbours = this.get(x, y - 1) + this.get(x + 1, y - 1) + this.get(x + 1, y) + this.get(x + 1, y + 1) +
                    this.get(x, y + 1) + this.get(x - 1, y) + this.get(x - 1, y + 1) + this.get(x - 1, y - 1);
                if (this.get(x, y) === 0 && livingNeighbours === 3) {
                    newState[x][y] = 1;
                } else if (this.get(x, y) === 1 && livingNeighbours >= 1 && livingNeighbours <= 4) {
                    newState[x][y] = 1;
                } else {
                    newState[x][y] = 0;
                }
            }
        }
        this.state = newState;
    }

    _createEmptyState() {
        return Array(WIDTH).fill(0).map(x => Array(HEIGHT).fill(0));
    }
}

let state = new State;
let textSize = 0;

function update(ts) {
    requestAnimationFrame(update);

    const offset = textSize < 4 ? 18 : 30 - (textSize * 3);
    const limit = textSize < 4 ? 42 : Math.min(WIDTH, offset + textSize * 6);
    state.iterate(offset, limit);

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (state.get(x, y)) {
                context.fillRect(x, y, 1, 1);
            }
        }
    }
    context.restore();
}

function onInput() {
    state = new State;
    let text = document.querySelector("input").value.toLocaleLowerCase().match(/[a-z ]/g);
    if (text === null) {
        return;
    }
    text = text.join("");
    textSize = text.length;
    [...text].forEach((c, i) => {
        if (i >= 10) return;
        if (!(c in letters)) {
            return;
        }
        const arr = letters[c];
        let y = 0;
        const offset = i * 6 + (30 - textSize * 3);
        arr.forEach(line => {
            for (let x = 0; x < 6; x++) {
                state.set(offset + x, y, line[x]);
            }
            y++;
        });
    });
}

update();

const letters = {
    a: [
        [0, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    b: [
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    c: [
        [0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    d: [
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    e: [
        [1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    f: [
        [1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    g: [
        [0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    h: [
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    i: [
        [0, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    j: [
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    k: [
        [1, 0, 0, 1, 1, 0],
        [1, 0, 1, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    l: [
        [1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    m: [
        [0, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    n: [
        [1, 0, 0, 0, 1, 0],
        [1, 1, 0, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 0, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    o: [
        [0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    p: [
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    q: [
        [0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 0, 1, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    r: [
        [0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 0, 1, 0, 0, 0],
        [1, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    s: [
        [0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    t: [
        [1, 1, 1, 1, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    u: [
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    v: [
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    w: [
        [1, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    x: [
        [1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    y: [
        [1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    z: [
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    " ": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]

};
