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

canvas.addEventListener("mouseup", e => {
    console.log("mouseup", e.offsetX, e.offsetY);
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
        }
    }
}, false);

function pointInsideRect(x, y, l, t, w, h) {
    return x > l && x < (l + w) && y > t && y < (t + h);
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

function moveToDischarge(coln) {
    let col = columns[coln];
    let cn = col[col.length - 1][0];
    let dn = discharge[discharge.length - 1][0];

    if ((cn == 13 && dn == 1) || (cn == 1 && dn == 13) || (cn + 1 == dn) || (cn - 1 == dn)) {
        discharge.push(col.pop());
    }
}

let deck = shuffleDeck(getDeck().concat(getDeck()));

// 10 columns with 8 cards.
let columns = [];
for (let i = 0; i < 10; i++) {
    columns[i] = deck.splice(0, 8);
}

let discharge = [];
discharge.push(deck.pop());

function animationFrame(timestamp) {
    window.requestAnimationFrame(animationFrame);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawColumns();

    // Draw deck
    let x = 321;
    let y = 200;
    if (deck.length > 1) {
        drawCard(1, 0, x, y, true);
        x += 3;
    }
    if (deck.length) {
        drawCard(1, 0, x, y, true);
    }

    // Draw discharge pile
    let dl = discharge.length;
    if (dl) {
        x = 404;
        let last = discharge[dl - 1];
        drawCard(last[0], last[1], x, y);
    }


    /*et x = 10;
    let y = 10;
    for (let i = 0; i < deck.length; i++) {
        drawCard(deck[i][0], deck[i][1], x, y);
        x += 13;
        if (x > canvas.width - CARD_WIDTH) {
            x = 13;
            y += 32;
        }
    }*/
}

window.requestAnimationFrame(animationFrame);