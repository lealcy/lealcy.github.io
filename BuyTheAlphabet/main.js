"use strict";

const COST = 2;

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
    buy.innerText = `Buy (${COST}x${value.lastLetter ? value.lastLetter : "✋"})`;
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

function update() {
    requestAnimationFrame(update);
    for (const [key, value] of letters) {
        const element = document.getElementById(key);
        element.querySelector(".quantity").innerText = value.quantity;
    }
}

requestAnimationFrame(update);