"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const text = document.querySelector("textarea");
const code =
    `on key ArrowUp goto up
on key ArrowRight goto right
on key ArrowDown goto down
on key ArrowLeft goto left

x = 0
y = 10

next: 
  clear
  text x, y, "Hello, World!"
  goto end

up:
  y = y - 1
  goto next

right:
  x = x + 1
  goto next

down:
  y = y + 1
  goto next

left:
  x = x - 1
  goto next

end:
  refresh
`;
text.value = code;

let lines = [];
let line = 0;
let refresh = false;
let jump = null;
let stop = false;
let sleep = 0;
const labels = new Map;
const vars = new Map;
const keymap = new Map;

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
instructions.set(/^\s*goto\s+([a-zA-Z0-9_]+)\s*/i, r => {
    jump = r[1];
});
instructions.set(/^\s*sleep\s+(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*/i, r => {
    sleep = solve(r[1]);
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
// Key values based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
instructions.set(/^\s*on\s+key\s+([a-zA-Z0-9_]+)\s+goto\s+([a-zA-Z0-9_]+)\s*/i, r => {
    keymap.set(r[1], r[2]);
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
        if (sleep) {
            setTimeout(() => parse(), sleep);
            sleep = 0;
            break;
        }
    }
}

function parseLine() {
    let text = lines[line];
    const label = text.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
    if (label) {
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
        console.log("jump", jump);
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
    if (r = x.match(/^(.+)-(.+)$/)) {
        return solve(r[1]) - solve(r[2]);
    }
    console.log("failed to solve x: ", x);
}

function parseLabels() {
    let line = 0;
    while (line < lines.length) {
        let text = lines[line];
        const label = text.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
        if (label) {
            console.log(`Label "${label[1]}" -> ${line}`);
            labels.set(label[1], line);
        }
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
    keymap.clear();
    vars.clear();
    stop = false;
    parseLabels();
    parse();
    console.log("end");
}, false);

document.querySelector("button#stop").addEventListener("click", e => {
    stop = true;
    console.log("stop");
}, false);

document.addEventListener("keydown", e => {
    //console.log(e.code);
    if (keymap.has(e.code) && labels.has(keymap.get(e.code))) {
        line = labels.get(keymap.get(e.code));
        //console.log("goto", line);
        parse();
    }
}, false);