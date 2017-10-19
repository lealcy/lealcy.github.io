import { resources } from "./resources.js";

export default class Game {
    constructor(buttonsEl) {
        this.buttonsEl = buttonsEl;
        this.lastTimestamp = 0;
    }

    run() {
        requestAnimationFrame(this.update.bind(this));
        /*if (!this.updateTimer) {
            this.updateTimer = setInterval(() => {
            }, 1000);
        }*/
    }

    /*top() {
        clearInterval(this.updateTimer);
    }*/

    update(timestamp) {
        requestAnimationFrame(this.update.bind(this));
        const frameTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        resources.forEach(r => {
            r.operate(frameTime);
            if (!r.enabled && ((r.craftable && r.canCraft()) || (!r.craftable && r.quantity > 0))) {
                this.createButton(r.id);
                r.enabled = true;
            }

            if (r.enabled) {
                const quantity = r.quantity > 0 && r.quantity < 1 ? "< 1" : r.quantity | 0;
                document.querySelector(`#${r.id} .quantity`).innerText = quantity;
            }
        });
    }

    createButton(id) {
        const buttonTemplateEl = document.getElementById("buttonTemplate");
        const clonedEl = buttonTemplateEl.content.cloneNode(true);
        const buttonEl = clonedEl.querySelector(".resource");
        buttonEl.id = id;
        const resource = resources.get(id);
        buttonEl.querySelector(".name").innerText = resource.name;
        buttonEl.querySelector(".image").src = `images/${id}.png`;
        buttonEl.addEventListener("click", e => {
            resource.craft();
        });
        this.buttonsEl.appendChild(clonedEl);
    }
}