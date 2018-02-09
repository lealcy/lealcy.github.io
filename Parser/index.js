"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const text = document.querySelector("textarea");
const code =
    `10 translate 0, 10
text "Hello, World!"
refresh
goto 10
`;
text.value = code;

let lines = [];
let line = 0;
let refresh = false;
let jump = null;
let stop = false;
const labels = new Map;

const instructions = new Map;
instructions.set(/^\s*canvas\s+(\d+)\s*,\s*(\d+)\s*$/i, r => {
    canvas.width = r[1];
    canvas.height = r[2];
});
instructions.set(/^\s*color\s+([a-zA-Z]+)\s*$/i, r => {
    context.fillStyle = r[1];
});
instructions.set(/^\s*text\s+"([^"]*)"(?:\s*,\s*(\d+))?\s*$/i, r => {
    context.fillText(r[1], 0, 0, r[2]);
});
instructions.set(/^\s*text\s+(\d+)\s*,\s*(\d+)\s*,\s*"([^"]*)"(?:\s*,\s*(\d+))?\s*$/i, r => {
    context.fillText(r[3], r[1], r[2], r[4]);
});
instructions.set(/^\s*refresh\s*$/i, r => {
    refresh = true;
});
instructions.set(/^\s*goto\s+([^\s]+)\s*/i, r => {
    jump = r[1];
});
instructions.set(/^\s*translate\s+(\d+)\s*,\s*(\d+)\s*$/i, r => {
    context.translate(r[1], r[2]);
});
instructions.set(/^\s*clear\s*$/i, r => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

function parse() {
    while (line < lines.length) {
        if (stop) return;
        parseLine();
        if (refresh) {
            refresh = false;
            requestAnimationFrame(() => parse());
            break;
        }
    }
}

function parseLine() {
    let text = lines[line];
    const label = text.match(/^\s*(\d+)\s+/);
    if (label) {
        console.log(`Label "${label[1]}" -> ${line}`);
        labels.set(label[1], line);
        text = text.substring(label[0].length);
    }
    for (const [regex, fn] of instructions) {
        const result = text.match(regex);
        if (result) {
            console.log(result);
            fn(result);
            break;
        }
    }
    if (jump !== null) {
        line = labels.get(jump);
        jump = null;
    } else {
        line++;
    }
}

document.querySelector("button#parse").addEventListener("click", e => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines = lines = text.value.split("\n").filter(v => v !== "");
    line = 0;
    labels.clear();
    stop = false;
    parse();
    console.log("end");
}, false);

document.querySelector("button#stop").addEventListener("click", e => {
    stop = true;
    console.log("stop");
}, false);