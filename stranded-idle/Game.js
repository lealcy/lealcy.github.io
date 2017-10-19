import { resources } from "./resources.js";

export default class Game {
    constructor(buttonsEl, resourcesEl) {
        this.buttonsEl = buttonsEl;
        this.resourcesEl = resourcesEl;
        this.updateTimer = null;
    }

    run() {
        if (!this.updateTimer) {
            this.updateTimer = setInterval(() => {
                this.resourcesEl.innerHTML = "";
                resources.forEach(r => {
                    r.operate();
                    if (r.craftable && !r.enabled && r.canCraft()) {
                        this.createButton(r.id);
                        r.enabled = true;
                    }
                    if (r.quantity > 0) {
                        this.resourcesEl.innerHTML += `<span>${r.name}: ${r.quantity < 1 ? "< 1" : r.quantity | 0}</span> | `;
                    }
                });
            }, 1000);
        }
    }

    stop() {
        clearInterval(this.updateTimer);
    }

    createButton(id) {
        const buttonEl = document.createElement("button");
        const resource = resources.get(id);
        buttonEl.id = id;
        buttonEl.innerText = resource.name;
        buttonEl.addEventListener("click", e => {
            resource.craft();
        });
        this.buttonsEl.appendChild(buttonEl);
    }
}