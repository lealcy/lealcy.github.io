"use strict";

const CLUB = 0;
const SPADE = 1;
const HEART = 2;
const DIAMOND = 3;
const CARD_WIDTH = 73;
const CARD_HEIGHT = 98;
const COLUMNS = 10;
const COLUMN_V_OFFSET = 8;
const COLUMN_H_OFFSET = 8;
const COLUMN_H_SPACING = 79;
const COLUMN_HEIGHT = 180;
const CARD_OVERLAP_V_OFFSET = 12;
const CARDS_PER_COLUMN = 7;
const PILE_X = 404;
const PILE_Y = 200;
const DECK_X = 321;
const DECK_Y = 200;
const BTN_HEIGHT = 26;
const BTN_TEXT_V_PADDING = 16;
const BTN_UNDO_X = 483;
const BTN_UNDO_Y = 271;
const BTN_UNDO_WIDTH = 70;
const BTN_RESET_X = 726;
const BTN_RESET_Y = 271;
const BTN_RESET_WIDTH = 64;
const FLAG_WIDTH = 29;
const FLAG_HEIGHT = 29;
const FLAG_EN_X = 758;
const FLAG_EN_Y = 308;
const FLAG_PTBR_X = 725;
const FLAG_PTBR_Y = 308;
const BASE_POINTS = 10;
const MOVE_SPEED = 0.08;


let cards = new Image(950, 392);
cards.src = "cards.png";

let backs = new Image(147, 98);
backs.src = "backs.png";

let preview = new Image(532, 265);
preview.src = "preview.png";

let flag_en = new Image(128, 128);
flag_en.src = "flag_en.webp";

let flag_ptbr = new Image(128, 128);
flag_ptbr.src = "flag_ptbr.webp";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let storage = window.localStorage;

let undos = [];
let win = false;
let deck = [];
let columns = [];
let discharge = [];
let points = 0;
let showPoints = 0;
let combo = 1;
let record = 0;
let maxCombo = 1;
let level = 1;
let games = 0;
let wins = 0;
let loses = 0;
let lang = "en";

let moveAnimation = {
    card: null,
    x: 0,
    y: 0,
    t: 1.0,
};

let wrongAnimation = {
    x: 0,
    y: 0,
    opacity: 0.0,
};


canvas.addEventListener("mouseup", e => {
    console.log(e.offsetX, e.offsetY);
    let x = COLUMN_V_OFFSET;
    let hit = false;
    for (let i = 0; i < COLUMNS; i++) {
        if (pointInsideRect(e.offsetX, e.offsetY, x, COLUMN_H_OFFSET, CARD_WIDTH, COLUMN_HEIGHT)) {
            moveToDischarge(i);
            hit = true;
            break;
        }
        x += COLUMN_H_SPACING;
    }
    if (!hit) {
        if (pointInsideRect(e.offsetX, e.offsetY, DECK_X, DECK_Y, CARD_WIDTH, CARD_HEIGHT)) {
            if (deck.length) {
                discharge.push(deck.pop());
                combo = 1;
                undos.push(() => {
                    deck.push(discharge.pop());
                });
            }
        } else if (pointInsideRect(e.offsetX, e.offsetY, BTN_UNDO_X, BTN_UNDO_Y, BTN_UNDO_WIDTH, BTN_HEIGHT)) {
            undo();
        } else if (pointInsideRect(e.offsetX, e.offsetY, BTN_RESET_X, BTN_RESET_Y, BTN_RESET_WIDTH, BTN_HEIGHT)) {
            if (win) {
                wins++;
            } else {
                loses++;
            }
            reset();
        } else if (pointInsideRect(e.offsetX, e.offsetY, FLAG_EN_X, FLAG_EN_Y, FLAG_WIDTH, FLAG_HEIGHT)) {
            lang = "en";
        } else if (pointInsideRect(e.offsetX, e.offsetY, FLAG_PTBR_X, FLAG_PTBR_Y, FLAG_WIDTH, FLAG_HEIGHT)) {
            lang = "ptbr";
        }
    }
    save();
    return false;
}, false);

function pointInsideRect(x, y, l, t, w, h) {
    return x > l && x < (l + w) && y > t && y < (t + h);
}

function undo() {
    if (undos.length) {
        win = false;
        undos.pop()();
        if (combo > 1) {
            combo--;
            points -= BASE_POINTS * combo * level;
        } else {
            combo = 1;
            points -= BASE_POINTS * level;
        }
    }
}

function load() {
    record = storage.getItem("record");
    maxCombo = storage.getItem("maxCombo");
    level = storage.getItem("level");
    games = storage.getItem("games");
    wins = storage.getItem("wins");
    loses = storage.getItem("loses");
    lang = storage.getItem("lang");
}

function save() {
    storage.setItem("record", record);
    storage.setItem("maxCombo", maxCombo);
    storage.setItem("level", level);
    storage.setItem("games", games);
    storage.setItem("wins", wins);
    storage.setItem("loses", loses);
    storage.setItem("lang", lang);
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

function drawCard(number, suit, x, y, back, opacity) {
    let cx, cy;
    if (back) {
        cx = suit == CLUB || suit == SPADE ? 0 : CARD_WIDTH;
        cy = 0;
    } else {
        cx = (number - 1) * CARD_WIDTH;
        cy = suit * CARD_HEIGHT;
    }
    ctx.save();
    if (opacity !== undefined) {
        ctx.globalAlpha = opacity;
    }
    ctx.drawImage(back ? backs : cards,
        cx, cy, CARD_WIDTH, CARD_HEIGHT,
        x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.restore();
}

function drawColumns() {
    let x = COLUMN_H_OFFSET;
    let y = COLUMN_V_OFFSET;

    columns.forEach((v, i) => {
        v.forEach((c, j, a) => {
            drawCard(c[0], c[1], x, y, j < a.length - 1);
            y += CARD_OVERLAP_V_OFFSET;
        });
        y = COLUMN_V_OFFSET;
        x += COLUMN_H_SPACING;
    });
}

function lerp(v1, v2, t) {
    return (1 - t) * v1 + t * v2;
};

function setMoveAnimation(card, x, y) {
    moveAnimation.card = card;
    moveAnimation.x = x;
    moveAnimation.y = y;
    moveAnimation.t = 0.0;
}

function setWrongAnimation(x, y) {
    wrongAnimation.x = x;
    wrongAnimation.y = y;
    wrongAnimation.opacity = 0.7;
}

function moveToDischarge(coln) {
    let col = columns[coln];
    let cn = col[col.length - 1][0];
    let dn = discharge[discharge.length - 1][0];

    if ((cn == 13 && dn == 1) || (cn == 1 && dn == 13) || (cn + 1 == dn) || (cn - 1 == dn)) {
        setMoveAnimation(col[col.length - 1], COLUMN_H_OFFSET + coln * COLUMN_H_SPACING, CARD_OVERLAP_V_OFFSET * col.length - 2);
        discharge.push(col.pop());
        points += combo * BASE_POINTS * level;
        combo++;
        maxCombo = Math.max(combo, maxCombo);
        undos.push(() => {
            col.push(discharge.pop());
        });
    } else {
        setWrongAnimation(COLUMN_H_OFFSET + coln * COLUMN_H_SPACING, CARD_OVERLAP_V_OFFSET * col.length - 2);
    }
}

function reset() {
    deck = shuffleDeck(getDeck().concat(getDeck()));

    // 10 columns with 8 cards.
    columns = [];
    for (let i = 0; i < COLUMNS; i++) {
        columns[i] = deck.splice(0, CARDS_PER_COLUMN);
    }

    if (win) {
        if (points > record) {
            record = points;
        }
        level++;
    } else {
        if (level > 1) {
            level--;
        }
        points = 0;
        showPoints = 0;
    }

    discharge = [];
    discharge.push(deck.pop());
    win = false;
    undos = [];
    combo = 1;
    games++;
}

function start() {
    reset();
    if (storage.getItem("games") === null) {
        save();
    } else {
        load();
    }
    window.requestAnimationFrame(animationFrame);
}

function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
}

function getButtonWidth(text) {
    return ctx.measureText(text).width + BTN_V_PADDING;
}

function animationFrame(timestamp) {
    window.requestAnimationFrame(animationFrame);
    ctx.fillStyle = "#293d3d";
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
        let last = moveAnimation.t < 1.0 ? discharge[dl - 2] : discharge[dl - 1];
        drawCard(last[0], last[1], x, y);
    }

    if (moveAnimation.card && moveAnimation.t < 1.0) {
        drawCard(
            moveAnimation.card[0],
            moveAnimation.card[1],
            lerp(moveAnimation.x, PILE_X, moveAnimation.t),
            lerp(moveAnimation.y, PILE_Y, moveAnimation.t)
        );
        moveAnimation.t += MOVE_SPEED;
    } else {
        moveAnimation.card = null;
    }

    if (wrongAnimation.opacity > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255,0,0,${wrongAnimation.opacity})`;
        ctx.fillRect(wrongAnimation.x, wrongAnimation.y, CARD_WIDTH, CARD_HEIGHT);
        ctx.restore();
        wrongAnimation.opacity -= 0.04;

    }

    // Draw undo button
    if (undos.length) {
        let undoText;
        switch (lang) {
            case "ptbr":
                undoText = "DESFAZER";
                break;
            default:
                undoText = "UNDO";
                break;
        }
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#ff6666";
        let padding = (BTN_UNDO_WIDTH - ctx.measureText(undoText).width) / 2;
        ctx.fillRect(BTN_UNDO_X, BTN_UNDO_Y, BTN_UNDO_WIDTH, BTN_HEIGHT);
        ctx.fillStyle = "white";
        ctx.fillText(undoText, BTN_UNDO_X + padding, BTN_UNDO_Y + BTN_TEXT_V_PADDING);

    }

    // Draw reset button
    let resetText;
    switch (lang) {
        case "ptbr":
            resetText = "NOVO JOGO";
            break;
        default:
            resetText = "NEW  GAME";
            break;
    }
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#0099cc";
    ctx.fillRect(BTN_RESET_X, BTN_RESET_Y, BTN_RESET_WIDTH, BTN_HEIGHT);
    ctx.fillStyle = "white";
    let padding = (BTN_RESET_WIDTH - ctx.measureText(resetText).width) / 2;
    ctx.fillText(resetText, BTN_RESET_X + padding, BTN_RESET_Y + BTN_TEXT_V_PADDING);

    // Draw language selection flags
    ctx.fillStyle = "#0099cc";
    switch (lang) {
        case "ptbr":
            roundedRect(FLAG_PTBR_X, FLAG_PTBR_Y, FLAG_WIDTH, FLAG_HEIGHT, 3);
            break;
        default:
            roundedRect(FLAG_EN_X, FLAG_EN_Y, FLAG_WIDTH, FLAG_HEIGHT, 3);
            break;
    }
    ctx.drawImage(flag_ptbr, FLAG_PTBR_X + 2, FLAG_PTBR_Y + 2, FLAG_WIDTH - 2, FLAG_HEIGHT - 2);
    ctx.drawImage(flag_en, FLAG_EN_X + 2, FLAG_EN_Y + 2, FLAG_WIDTH - 2, FLAG_HEIGHT - 2);

    // Draw win
    if (win) {
        ctx.fillStyle = "white";
        let textGeo;
        switch (lang) {
            case "ptbr":
                ctx.font = "60px sans-serif";
                textGeo = ctx.measureText("Você Venceu!");
                ctx.fillText("Você Venceu!", canvas.width / 2 - textGeo.width / 2, 120);
                break;
            default:
                ctx.font = "60px sans-serif";
                textGeo = ctx.measureText("You Win!");
                ctx.fillText("You Win!", canvas.width / 2 - textGeo.width / 2, 120);
                break;
        }
    }

    // Draw Stats
    ctx.fillStyle = "white";
    switch (lang) {
        case "ptbr":
            ctx.font = "30px sans-serif";
            ctx.fillText(`${showPoints} (recorde: ${record})`, 8, 230);
            ctx.font = "15px sans-serif";
            ctx.fillText(`Combo: x${combo} (recorde: x${maxCombo})`, 8, 250);
            ctx.fillText(`Nível: ${level}`, 8, 270);
            ctx.fillText(`Jogos: ${games} (${wins} vitórias / ${loses} derrotas)`, 8, 290);
            break;
        default:
            ctx.font = "30px sans-serif";
            ctx.fillText(`${showPoints} (record: ${record})`, 8, 230);
            ctx.font = "15px sans-serif";
            ctx.fillText(`Combo: x${combo} (record: x${maxCombo})`, 8, 250);
            ctx.fillText(`Level: ${level}`, 8, 270);
            ctx.fillText(`Games: ${games} (${wins} wins / ${loses} loses)`, 8, 290);
            break;
    }

    if (showPoints < points) {
        showPoints++;
    }

    ctx.font = "11px sans-serif";
    ctx.fillText(deck.length, DECK_X + 1, DECK_Y + 10 + CARD_HEIGHT);

    // Draw tutorial
    ctx.drawImage(preview, 10, 340);
    ctx.fillStyle = "#0099cc";
    switch (lang) {
        case "ptbr":
            ctx.font = "15px sans-serif";
            ctx.fillText("1. O objetivo desse jogo e mover", 550, 360);
            ctx.fillText("todas as cartas das colunas para", 555, 375);
            ctx.fillText("a pilha de descarte (2) em ordem.", 555, 390);
            ctx.fillText("crescente ou decrescente. O naipe", 555, 405);
            ctx.fillText("não importa.", 555, 420);
            ctx.fillText("2. Se não existir mais cartas nas", 550, 440);
            ctx.fillText("colunas para seguir a sequência,", 555, 455);
            ctx.fillText("clique no monte para tirar uma", 555, 470);
            ctx.fillText("carta e colocar na pilha.", 555, 485);
            ctx.fillText("Continue tirando cartas até", 555, 500);
            ctx.fillText("encontrar uma que possa dar ", 555, 515);
            ctx.fillText("seguimento a sequência.", 555, 530);
            ctx.fillText("Você ganha o jogo ao mover todas", 550, 550);
            ctx.fillText("as cartas das colunas para a", 555, 565);
            ctx.fillText("pilha. Você perde se ficar sem", 555, 580);
            ctx.fillText("jogadas.", 555, 595);
            break;
        default:
            ctx.font = "15px sans-serif";
            ctx.fillText("1. The purpose of the game is to", 550, 360);
            ctx.fillText("move cards from the columns to the", 555, 375);
            ctx.fillText("discharge pile (2) in increasing or", 555, 390);
            ctx.fillText("decreasing order. Suits don't matter.", 555, 405);
            ctx.fillText("2. If there's no more suitable card in", 550, 425);
            ctx.fillText("the columns to move. click in the", 555, 440);
            ctx.fillText("deck will draw a new card, to the", 555, 455);
            ctx.fillText("pile. Draw new cards until you find", 555, 470);
            ctx.fillText("one to start a new sequence.", 555, 485);
            ctx.fillText("You win the game by moving all the", 550, 505);
            ctx.fillText("cards from the columns to the pile.", 555, 520);
            ctx.fillText("You lose if there's no more valid", 555, 535);
            ctx.fillText("moves.", 555, 550);
            break;
    }
}

start();