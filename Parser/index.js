"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const taEl = document.querySelector("textarea");
const code =
    `on key ArrowUp dy = -1
on key ArrowRight dx = 1
on key ArrowDown dy = 1
on key ArrowLeft dx = -1

x = width / 2
y = height / 2
dx = 1
dy = 1
hello = "Hello, World!"

repeat:
  x = x + dx
  y = y + dy
  if x < 0 then dx = 1
  if x > width - 58 then dx = -1
  if y < 10 then dy = 1
  if y > height then dy = -1
  clear
  text x, y, hello
  sleep 15
  repeat
`;
taEl.value = code;

let lines = [];
let line = 0;
let refresh = false;
let goto = null;
let ret = null;
let stop = false;
let sleep = 0;
const labels = new Map;
const stack = [];

const vars = new Map;
vars.set("width", canvas.width);
vars.set("height", canvas.height);

const keymap = new Map;

const instructions = new Map;

instructions.set(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/, r => {
    vars.set(r[1], solve(r[2]));
});

instructions.set(/^canvas\s+(.*)$/, r => {
    r = params(r[1]);
    if (r.length !== 2) {
        console.error("Invalid canvas arguments:", r);
    } else {
        canvas.width = solve(r[0]);
        canvas.height = solve(r[1]);
        vars.set("width", canvas.width);
        vars.set("height", canvas.height);
    }
});

instructions.set(/^color\s+([a-zA-Z]+)$/, r => {
    context.fillStyle = r[1];
});

instructions.set(/^text\s+(.*)$/, r => {
    r = params(r[1]);
    switch (r.length) {
        case 1:
            context.fillText(solve(r[0]), 0, 0);
            break;
        case 2:
            context.fillText(solve(r[0]), 0, 0, solve(r[1]));
            break;
        case 3:
            context.fillText(solve(r[2]), solve(r[0]), solve(r[1]));
            break;
        case 4:
            context.fillText(solve(r[2]), solve(r[0]), solve(r[1]), solve(r[3]));
            break;
        default:
            console.log("Invalid text arguments:", r);
            break;

    }
});

instructions.set(/^rect\s+(.*)$/, r => {
    r = params(r[1]);
    switch (r.length) {
        case 1:
            context.fillRect(0, 0, solve(r[0]), solve(r[0]));
            break;
        case 2:
            context.fillRect(0, 0, solve(r[0]), solve(r[1]));
            break;
        case 3:
            context.fillRect(solve(r[0]), solve(r[1]), solve(r[2]), solve(r[2]));
            break;
        case 4:
            context.fillrect(solve(r[0]), solve(r[1]), solve(r[2]), solve(r[3]));
            break;
        default:
            console.log("Invalid rect arguments:", r);
            break;
    }
});

instructions.set(/^refresh$/, r => {
    refresh = true;
});

instructions.set(/^goto\s+([a-zA-Z0-9_]+)\s*/, r => {
    goto = r[1];
});

instructions.set(/^return$/, r => {
    if (stack.length) {
        ret = stack.pop();
    } else {
        console.log("Returning on an empty stack.");
    }
});

instructions.set(/^sleep\s+(.*)$/, r => {
    sleep = solve(r[1]);
});

instructions.set(/^translate\s+(.*)$/, r => {
    r = params(r[1]);
    if (r.length !== 2) {
        console.error("Invalid translate arguments:", r);
    } else {
        context.translate(solve(r[0]), solve(r[1]));
    }
});

instructions.set(/^scale\s+(.*)$/, r => {
    r = params(r[1]);
    if (r.length === 1) {
        context.scale(solve(r[0]), solve(r[0]));
    } else if (r.length === 2) {
        context.scale(solve(r[0]), solve(r[1]));
    } else {
        console.error("Invalid scale arguments:", r);
    }
});

instructions.set(/^rotate\s+(.*)$/, r => {
    context.rotate(solve(r[1]) * Math.PI / 180);
});

instructions.set(/^clear$/, r => {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
});

instructions.set(/^save$/, r => {
    context.save();
});

instructions.set(/^restore$/, r => {
    context.restore();
});

instructions.set(/^reset$/, r => {
    context.setTransform(1, 0, 0, 1, 0, 0);
});

instructions.set(/^if\s+(.*)\s+then\s+(.*)$/, r => {
    if (solve(r[1])) {
        execute(r[2]);
    }
});

// Key values based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
instructions.set(/^on\s+key\s+([a-zA-Z0-9_]+)\s+(.*)$/, r => {
    //console.log("onkey", r);
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
    execute(lines[line]);
    if (ret !== null) {
        line = ret;
        ret = null;
    } else if (goto !== null) {
        //console.log("goto", goto);
        if (labels.has(goto)) {
            line = labels.get(goto);
            if (stack[stack.length - 1] !== line) {
                stack.push(line);
            }
            goto = null;
        } else {
            console.log("Invalid jump label:", goto);
        }
    } else {
        line++;
    }
}

function execute(text) {
    if (text == "") {
        return;
    }
    for (const [regex, fn] of instructions) {
        const result = text.match(regex);
        if (result) {
            //console.log(result);
            fn(result);
            return;
        }
    }
    if (labels.has(text)) {
        goto = text;
        return;
    }
    console.log("Unable to execute:", text);
}

function params(text) {
    let ps = [];
    let p = "";
    let insideString = false;
    let escaped = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        switch (c) {
            case "\"":
                if (insideString) {
                    if (escaped) {
                        escaped = false;
                    } else {
                        insideString = false;
                    }
                } else {
                    insideString = true;
                }
                p += c;
                break;
            case "\\":
                if (insideString) {
                    escaped = true;
                }
                p += c;
                break;
            case ",":
                if (insideString) {
                    p += c;
                    break;
                }
                ps.push(p);
                p = "";
                continue;
            case " ":
            case "\t":
                if (insideString) {
                    p += c;
                }
                break;
            default:
                p += c;
                break;
        }
    }
    ps.push(p);
    return ps;
}

function solve(x) {
    if (x === undefined) {
        return;
    }
    x = x.trim();
    //console.log(`Solve = ${x}`);

    if (/^-?\d+$/.test(x)) {
        return parseInt(x);
    }
    if (/^".*"$/.test(x)) {
        return x.slice(1, -1);
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(x)) {
        return vars.get(x);
    }

    let r;

    if (r = x.match(/^(.+)==(.+)$/)) {
        return solve(r[1]) == solve(r[2]);
    }

    if (r = x.match(/^(.+)!=(.+)$/)) {
        return solve(r[1]) != solve(r[2]);
    }

    if (r = x.match(/^(.+)>(.+)$/)) {
        return solve(r[1]) > solve(r[2]);
    }

    if (r = x.match(/^(.+)<(.+)$/)) {
        return solve(r[1]) < solve(r[2]);
    }

    if (r = x.match(/^(.+)>=(.+)$/)) {
        return solve(r[1]) >= solve(r[2]);
    }

    if (r = x.match(/^(.+)<=(.+)$/)) {
        return solve(r[1]) <= solve(r[2]);
    }

    if (r = x.match(/^(.+)\*(.+)$/)) {
        return solve(r[1]) * solve(r[2]);
    }

    if (r = x.match(/^(.+)\/(.+)$/)) {
        return solve(r[1]) / solve(r[2]);
    }

    if (r = x.match(/^(.+)\+(.+)$/)) {
        return solve(r[1]) + solve(r[2]);
    }

    if (r = x.match(/^(.+)-(.+)$/)) {
        return solve(r[1]) - solve(r[2]);
    }

    console.log("Failed to solve x: ", x);
}

function parseLabels() {
    let line = 0;
    while (line < lines.length) {
        let text = lines[line];
        const label = text.match(/^([a-zA-Z0-9_]+)\s*:/);
        if (label) {
            console.log(`Label "${label[1]}" -> ${line}`);
            labels.set(label[1], line);
            lines[line] = lines[line].substring(label[0].length).trim();
        }
        line++;
    }
}

document.querySelector("button#parse").addEventListener("click", e => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines = lines = taEl.value.split("\n").map(v => v.trim()).filter(v => v !== "");
    line = 0;
    labels.clear();
    keymap.clear();
    vars.clear();
    vars.set("width", canvas.width);
    vars.set("height", canvas.height);
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
    if (keymap.has(e.code)) {
        execute(keymap.get(e.code));
    }
}, false);
