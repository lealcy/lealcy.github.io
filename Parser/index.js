"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const text = document.querySelector("textarea");
const code =
    `x = 0
y = 10
10 clear
text x, y, "Hello, World!"
y = y + 1
x = x + 1
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
const vars = new Map;

const instructions = new Map;
instructions.set(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)\s*/i, r => {
    vars.set(r[1], solve(r[2]));
});
instructions.set(/^\s*canvas\s+(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*$/i, r => {
    canvas.width = solve(r[1]);
    canvas.height = solve(r[2]);
});
instructions.set(/^\s*color\s+([a-zA-Z]+)\s*$/i, r => {
    context.fillStyle = r[1];
});
instructions.set(/^\s*text\s+(\d+|"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)(?:\s*,\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*))?\s*$/i, r => {
    context.fillText(solve(r[1]), 0, 0, solve(r[2]));
});
instructions.set(/^\s*text\s+(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*(\d+|"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)(?:\s*,\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*))?\s*$/i, r => {
    context.fillText(r[3], solve(r[1]), solve(r[2]), solve(r[4]));
});
instructions.set(/^\s*refresh\s*$/i, r => {
    refresh = true;
});
instructions.set(/^\s*goto\s+(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*/i, r => {
    jump = solve(r[1]);
});
instructions.set(/^\s*translate\s+(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*$/i, r => {
    context.translate(solve(r[1]), solve(r[2]));
});
instructions.set(/^\s*clear\s*$/i, r => {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
});
instructions.set(/^\s*reset\s*$/i, r => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "white";
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
        //console.log(`Label "${label[1]}" -> ${line}`);
        labels.set(parseInt(label[1]), line);
        text = text.substring(label[0].length);
    }
    for (const [regex, fn] of instructions) {
        const result = text.match(regex);
        if (result) {
            //console.log(result);
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

function solve(x) {
    if (x === undefined) {
        return;
    }
    x = x.trim();
    if (/^\d+$/.test(x)) {
        return parseInt(x);
    }
    if (/^".*"$/.test(x)) {
        return x.slice(1, -1);
    }
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(x)) {
        return vars.get(x);
    }
    let r;
    if (r = x.match(/^(.+)\+(.+)$/)) {
        return solve(r[1]) + solve(r[2]);
    }
    console.log("fail to solve X", x);
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