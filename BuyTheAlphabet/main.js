"use strict";

const COST = 2;
const BUY_TIME = 1000;

function createFromTemplate(templateId) {
    return document.importNode(document.getElementById(templateId).content, true).firstElementChild;
}

const letters = new Map;
let lastLetter = null;
for (let a = "A".charCodeAt(0); a <= "Z".charCodeAt(0); a++) {
    const letter = String.fromCharCode(a);
    letters.set(letter, { quantity: 0, lastLetter });
    lastLetter = letter;
}


for (const [key, value] of letters) {
    const element = createFromTemplate("letter");
    element.id = key;
    element.querySelector(".name").innerText = key;
    const lastLetter = letters.get(value.lastLetter);
    const buy = element.querySelector(".buy");
    buy.innerText = `Buy (${value.lastLetter ? COST : 1}x${value.lastLetter ? value.lastLetter : "✋"})`;
    buy.addEventListener("click", e => {
        if (!lastLetter) {
            value.quantity++;
        } else if (lastLetter.quantity >= COST) {
            lastLetter.quantity -= COST;
            value.quantity++;
        }
    });
    document.body.appendChild(element);
}


let elapsedTime = 0;
let lastTime = null;
function update(time) {
    requestAnimationFrame(update);
    if (lastTime === null) {
        lastTime = time;
    } else {
        elapsedTime += time - lastTime;
        lastTime = time;
    }
    let lastLetter = null;
    for (const [key, value] of letters) {
        const element = document.getElementById(key);
        if (elapsedTime >= BUY_TIME) {
            if (lastLetter !== null) {
                letters.get(lastLetter).quantity += value.quantity;
            }
            lastLetter = key;
        }
        element.querySelector(".quantity").innerText = value.quantity;
    }
    if (elapsedTime >= BUY_TIME) {
        elapsedTime = 0;
    }
}

requestAnimationFrame(update);
