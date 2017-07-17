"use strict";

const CLUB = 0;
const SPADE = 1;
const HEART = 2;
const DIAMOND = 3;
const CARD_WIDTH = 73;
const CARD_HEIGHT = 98;

let cards = new Image(950, 392);
cards.src = "cards.png";

let backs = new Image(147, 98);
backs.src = "backs.png";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let undos = [];
let win = false;
let deck = [];
let columns = [];
let discharge = [];
let points = 0;
let combo = 1;
let record = 0;
let maxCombo = 1;
let games = 0;

canvas.addEventListener("dblclick", () => { return false }, false);
canvas.addEventListener("mousedown", () => { return false }, false);
canvas.addEventListener("mouseup", e => {
    console.log(e.offsetX, e.offsetY);
    let x = 8;
    if (pointInsideRect(e.offsetX, e.offsetY, x, 10, CARD_WIDTH, 180)) {
        moveToDischarge(0);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(1);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(2);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(3);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(4);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(5);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(6);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(7);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(8);
    } else if (pointInsideRect(e.offsetX, e.offsetY, x += 80, 10, CARD_WIDTH, 180)) {
        moveToDischarge(9);
    } else if (pointInsideRect(e.offsetX, e.offsetY, 321, 200, CARD_WIDTH, CARD_HEIGHT)) {
        if (deck.length) {
            discharge.push(deck.pop());
            combo = 1;
            undos.push(() => {
                deck.push(discharge.pop());
            });
        }
    } else if (pointInsideRect(e.offsetX, e.offsetY, 483, 271, 50, 26)) {
        undo();
    } else if (pointInsideRect(e.offsetX, e.offsetY, canvas.width - 55, 271, 50, 26)) {
        reset();
    }
    return false;
}, false);

function pointInsideRect(x, y, l, t, w, h) {
    return x > l && x < (l + w) && y > t && y < (t + h);
}

function undo() {
    if (undos.length) {
        win = false;
        undos.pop()();
        points -= 10 * combo;
        combo = 1;
    }
}

function getDeck() {
    let deck = [];
    for (let n = 1; n < 14; n++) {
        for (let s = 0; s < 4; s++) {
            deck.push([n, s]);
        }
    }
    return deck;
}

function getShuffledDeck() {
    return shuffleDeck(getDeck());
}

function shuffleDeck(deck) {
    let i = 0;
    let j = 0;
    let temp = null;

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    return deck;
}

function drawCard(number, suit, x, y, back) {
    let cx, cy;
    if (back) {
        cx = suit == CLUB || suit == SPADE ? 0 : CARD_WIDTH;
        cy = 0;
    } else {
        cx = (number - 1) * CARD_WIDTH;
        cy = suit * CARD_HEIGHT;
    }
    ctx.drawImage(back ? backs : cards,
        cx, cy, CARD_WIDTH, CARD_HEIGHT,
        x, y, CARD_WIDTH, CARD_HEIGHT);
}

function drawColumns() {
    let x = 8;
    let y = 10;

    columns.forEach((v, i) => {
        v.forEach((c, j, a) => {
            drawCard(c[0], c[1], x, y, j < a.length - 1);
            y += 12;
        });
        y = 10;
        x += 79;
    });
}

function drawWinScreen() {
    ctx.font = "14px sans-serif";
    textGeo = ctx.measureText("Click to try again!");
    ctx.fillText("Click to try again!", canvas.width / 2 - textGeo.width / 2, canvas.height / 2 + 20);
}

function moveToDischarge(coln) {
    let col = columns[coln];
    let cn = col[col.length - 1][0];
    let dn = discharge[discharge.length - 1][0];

    if ((cn == 13 && dn == 1) || (cn == 1 && dn == 13) || (cn + 1 == dn) || (cn - 1 == dn)) {
        discharge.push(col.pop());
        points += combo * 10;
        combo++;
        maxCombo = Math.max(combo, maxCombo);
        undos.push(() => {
            col.push(discharge.pop());
        });
    }
}

function reset() {
    deck = shuffleDeck(getDeck().concat(getDeck()));

    // 10 columns with 8 cards.
    columns = [];
    for (let i = 0; i < 10; i++) {
        columns[i] = deck.splice(0, 8);
    }

    if (win) {
        if (points > record) {
            record = points;
        }
        games++;
    } else {
        games = 1;
        points = 0;
    }

    discharge = [];
    discharge.push(deck.pop());
    win = false;
    undos = [];
    combo = 1;
}

function start() {
    reset();
    window.requestAnimationFrame(animationFrame);
}

function animationFrame(timestamp) {
    window.requestAnimationFrame(animationFrame);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    win = true;
    columns.forEach(v => {
        if (v.length) {
            win = false;
        }
    });

    drawColumns();

    // Draw deck
    let x = 321;
    let y = 200;
    if (deck.length > 1) {
        let alast = deck[deck.length - 2];
        drawCard(alast[0], alast[1], x, y, true);
        x += 3;
    }
    if (deck.length) {
        let last = deck[deck.length - 1];
        drawCard(last[0], last[1], x, y, true);
    }

    // Draw discharge pile
    let dl = discharge.length;
    if (dl) {
        x = 404;
        let last = discharge[dl - 1];
        drawCard(last[0], last[1], x, y);
    }

    // Draw undo button
    if (undos.length) {
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#ff6666";
        ctx.fillRect(483, 271, 50, 26);
        ctx.fillStyle = "white";
        ctx.fillText("UNDO", 493, 287, 50);
    }

    // Draw reset button
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#0099cc";
    ctx.fillRect(canvas.width - 55, 271, 50, 26);
    ctx.fillStyle = "white";
    ctx.fillText("RESET", canvas.width - 47, 287, 50);


    // Draw win
    if (win) {
        ctx.fillStyle = "white";
        ctx.font = "60px sans-serif";
        let textGeo = ctx.measureText("You Win!");
        ctx.fillText("You Win!", canvas.width / 2 - textGeo.width / 2, canvas.height / 2 + 60);
    }

    // Draw Stats
    ctx.fillStyle = "white";
    ctx.font = "30px sans-serif";
    ctx.fillText(`${points} (record: ${record})`, 8, 230);
    ctx.font = "15px sans-serif";
    ctx.fillText(`Combo: x${combo} (record: x${maxCombo})`, 8, 250);
    ctx.font = "15px sans-serif";
    ctx.fillText(`Games: ${games}`, 8, 270);
    ctx.font = "11px sans-serif";
    ctx.fillText(`(${deck.length})`, 322, 210 + CARD_HEIGHT);


}

start();