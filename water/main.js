"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;

const SCALE = 10;
const WIDTH = Math.floor(canvas.width / SCALE);
const HEIGHT = Math.floor(canvas.height / SCALE);
let stopped = true;
let textSize = 0;
let state = Array(WIDTH).fill(0).map(x => Array(HEIGHT).fill(0));

let mousex = 0;
let mousey = 0;
let mousebutton = -1;
canvas.addEventListener("mousedown", e => mousebutton = e.button, false);
canvas.addEventListener("mouseup", e => mousebutton = -1, false);
canvas.addEventListener("mousemove", mousemove, false);
canvas.addEventListener("contextmenu", e => e.preventDefault(), false);
context.scale(SCALE, SCALE);

function mousemove(e) {
    mousex = Math.floor(e.offsetX / SCALE);
    mousey = Math.floor(e.offsetY / SCALE);
}

function update(ts) {
    requestAnimationFrame(update);
    if (mousebutton !== -1) {
        stop();
        //console.log("click", mousebutton, mousex, mousey);
        //get(state[mousex,  mousey)] = get(state[mousex,  mousey)] ? 0 : 1;
        if (mousebutton === 0) {
            state[mousex][mousey] = 1;
        } else {
            state[mousex][mousey] = 0;
        }

    }
    if (!stopped) {
        const newState = Array(WIDTH).fill(0).map(x => Array(HEIGHT).fill(0));
        const offset = textSize < 4 ? 18 : 30 - (textSize * 3);
        const limit = textSize < 4 ? 42 : Math.min(WIDTH, offset + textSize * 6);
        for (let x = offset; x < limit; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                const livingNeighbours = get(x, y - 1) + get(x + 1, y - 1) + get(x + 1, y) + get(x + 1, y + 1) +
                    get(x, y + 1) + get(x - 1, y) + get(x - 1, y + 1) + get(x - 1, y - 1);
                if (get(x, y) === 0 && livingNeighbours === 3) {
                    newState[x][y] = 1;
                } else if (get(x, y) === 1 && livingNeighbours >= 1 && livingNeighbours <= 4) {
                    newState[x][y] = 1;
                } else {
                    newState[x][y] = 0
                }
            }
        }
        state = newState;
    }

    //fluid();
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (get(x, y)) {
                context.fillRect(x, y, 1, 1);
            }
        }
    }
    context.restore();
}

function get(x, y) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        return 0;
    }
    return state[x][y];
}

function start() {
    stopped = false;
}

function stop() {
    stopped = true;
}

function clean() {
    state = Array(WIDTH).fill(0).map(x => Array(HEIGHT).fill(0));
    start();
}

function paste() {
    clean();
    let text = document.querySelector("input").value.toLocaleLowerCase().match(/[a-z]/g);
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
                state[offset + x][y] = line[x];
            }
            y++;
        });
    });
}

function dump() {
    const arr = Array(6).fill(0).map(x => Array(6).fill(0));
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
            arr[x][y] = state[y][x];
        }
    }
    console.log(JSON.stringify(arr));
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
