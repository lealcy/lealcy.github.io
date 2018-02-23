"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false
});
const taEl = document.querySelector("textarea");
// Based on https://robots.thoughtbot.com/pong-clone-in-javascript
const code =
    `canvas 400, 600

playerPaddleX = 175
playerPaddleY = 580
playerPaddleWidth = 50
playerPaddleHeight = 10
playerPaddleXSpeed = 0
playerPaddleYSpeed = 0

computerPaddleX = 175
computerPaddleY = 10
computerPaddleWidth = 50
computerPaddleHeight = 10
computerPaddleXSpeed = 0
computerPaddleYSpeed = 0

ballX = 200
ballY = 300
ballXSpeed = 0
ballYSpeed = 3
ballRadius = 5

loop:
  update
  render
  refresh
  loop

update:
  updatePlayer
  updateBall
  return

render:
  color magenta
  rect width, height
  color blue
  rect playerPaddleX, playerPaddleY, playerPaddleWidth, playerPaddleHeight
  rect computerPaddleX, computerPaddleY, computerPaddleWidth, computerPaddleHeight
  color black
  circle ballX, ballY, ballRadius
  return

updatePlayer:
  if keydown("ArrowLeft") then movePlayerPaddleLeft
  if keydown("ArrowRight") then movePlayerPaddleRight
  ;if keyup("ArrowLeft") && keyup("ArrowRight) then stopPlayerPaddle
  updatePlayerPaddlePosition
  return

updateBall:
  ballX = ballX + ballXSpeed
  ballY = ballY + ballYSpeed
 
  if ballX - 5 < 0 then bounceLeft
  if ballX + 5 > 400 then bounceRight

  if ballY < 0 || ballY > 600 then point

  if intersect(playerPaddleX, playerPaddleY, playerPaddleWidth, playerPaddleHeight, ballX - 5, ballY - 5, 10, 10) then hitPlayerPaddle
  if intersect(computerPaddleX, computerPaddleY, computerPaddleWidth, computerPaddleHeight, ballX - 5, ballY - 5, 10, 10) then hitComputerPaddle


  return

bounceLeft:
  ballX = 5
  ballXSpeed = 0-ballXSpeed
  return

bounceRight:
  ballX = 395
  ballXSpeed = 0-ballXSpeed
  return

point:
  ballX = 200
  ballY = 300
  ballXSpeed = 0
  ballYSpeed = 3 
  return

hitPlayerPaddle:
  ballYSpeed = -3
  halfXSpeed = playerPaddleXSpeed / 2
  ballXSpeed = ballXSpeed + halfXSpeed
  ballY = ballY + ballYSpeed
  return

hitComputerPaddle:
  ballYSpeed = 3
  halfXSpeed = computerPaddleXSpeed / 2
  ballXSpeed = ballXSpeed + halfXSpeed
  ballY = ballY + ballYSpeed
  return 

movePlayerPaddleLeft:
  playerPaddleXSpeed = -4
  playerPaddleX = playerPaddleX + playerPaddleXSpeed
  return 

movePlayerPaddleRight:
  playerPaddleXSpeed = 4
  playerPaddleX = playerPaddleX + playerPaddleXSpeed
  
  return 

updatePlayerPaddlePosition:
  if playerPaddleX < 0 then stopPlayerPaddleLeft
  if playerPaddleX + playerPaddleWidth > 400 then stopPlayerPaddleRight
  return

stopPlayerPaddleLeft:
  playerPaddleX = 0
  return

stopPlayerPaddleRight:
  playerPaddleX = 400 - playerPaddleWidth
  playerPaddleXSpeed = 0
  return

stopPlayerPaddle:
  playerPaddleXSpeed = 0
  return   

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
let stack = [];

const vars = new Map;
vars.set("width", canvas.width);
vars.set("height", canvas.height);

const funcs = new Map([
    ["keydown", ps => keysDown.has(ps[0])],
    ["keyup", ps => !keysDown.has(ps[0])],
    ["sqrt", ps => Math.sqrt(...ps)],
    ["intersect", ps => {
        const ax = ps[0],
            ay = ps[1],
            aw = ps[2],
            ah = ps[3];
        const bx = ps[4],
            by = ps[5],
            bw = ps[6],
            bh = ps[7];
        return Math.max(ax, bx) < Math.min(ax + aw, bx + bw) &&
            Math.max(ay, by) < Math.min(ay + ah, by + bh);
    }]
]);

// Key values based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
const keysDown = new Set;

const instructions = new Map;

instructions.set(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/, r => {
    vars.set(r[1], solve(r[2]));
});

instructions.set(/^canvas\s+(.+)$/, r => {
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

instructions.set(/^color\s+(.+)$/, r => {
    context.fillStyle = r[1];
});

instructions.set(/^text\s+(.+)$/, r => {
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

instructions.set(/^circle\s+(.+)$/, r => {
    r = params(r[1]);
    switch (r.length) {
        case 1:
            context.beginPath();
            context.arc(0, 0, solve(r[0]), 0, 2 * Math.PI, false);
            context.fill();
            break;
        case 3:
            context.beginPath();
            context.arc(solve(r[0]), solve(r[1]), solve(r[2]), 0, 2 * Math.PI, false);
            context.fill();
            break;
        default:
            console.log("Invalid circle arguments:", r);
            break;
    }
});

instructions.set(/^rect\s+(.+)$/, r => {
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
            context.fillRect(solve(r[0]), solve(r[1]), solve(r[2]), solve(r[3]));
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

instructions.set(/^sleep\s+(.+)$/, r => {
    sleep = solve(r[1]);
});

instructions.set(/^translate\s+(.+)$/, r => {
    r = params(r[1]);
    if (r.length !== 2) {
        console.error("Invalid translate arguments:", r);
    } else {
        context.translate(solve(r[0]), solve(r[1]));
    }
});

instructions.set(/^scale\s+(.+)$/, r => {
    r = params(r[1]);
    if (r.length === 1) {
        context.scale(solve(r[0]), solve(r[0]));
    } else if (r.length === 2) {
        context.scale(solve(r[0]), solve(r[1]));
    } else {
        console.error("Invalid scale arguments:", r);
    }
});

instructions.set(/^rotate\s+(.+)$/, r => {
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

instructions.set(/^log\s+(.+)$/, r => {
    console.log(...params(r[1]).map(v => solve(v)));
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
        if (labels.has(goto)) {
            stack.push(line + 1);
            line = labels.get(goto);
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
        if (!vars.has(x)) {
            console.log('Unknown variable', x);
        }
        return vars.get(x);
    }

    let r;

    if (r = x.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/)) {
        return funcs.get(r[1])(params(r[2]).map(v => solve(v)));
    }

    if (r = x.match(/^(.+)\|\|(.+)$/)) {
        return solve(r[1]) || solve(r[2]);
    }

    if (r = x.match(/^(.+)&&(.+)$/)) {
        return solve(r[1]) && solve(r[2]);
    }

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

function runEvent(e) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines = taEl.value.split("\n").map(v => v.trim()).filter(v => v !== "" && !v.startsWith(";"));
    line = 0;
    labels.clear();
    keysDown.clear();
    vars.clear();
    vars.set("width", canvas.width);
    vars.set("height", canvas.height);
    stack = [];
    goto = null;
    ret = null;
    stop = false;
    parseLabels();
    parse();
    console.log("end");
}

function stopEvent(e) {
    stop = true;
    console.log("stop");
}

document.querySelector("button#parse").addEventListener("click", runEvent, false);
document.querySelector("button#stop").addEventListener("click", stopEvent, false);

document.addEventListener("keydown", e => {
    keysDown.add(e.code);
}, false);

document.addEventListener("keyup", e => {
    keysDown.delete(e.code);
}, false);
