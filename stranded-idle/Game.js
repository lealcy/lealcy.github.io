import { resources } from "./resources.js";

export default class Game {
    constructor(buttonsEl) {
        this.buttonsEl = buttonsEl;
        this.lastTimestamp = 0;
    }

    run() {
        requestAnimationFrame(this.update.bind(this));
    }

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
                const buttonEl = document.getElementById(r.id);
                const quantity = r.quantity > 0 && r.quantity < 1 ? "< 1" : r.quantity | 0;
                buttonEl.querySelector(".quantity").innerText = quantity;
                let progress = 0;
                if (r.canProduce() && r.produceTime) {
                    progress = r.operationTime / r.produceTime;
                }
                buttonEl.querySelector(".progress").value = progress;
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
        const chronometerEl = document.createElement("img");
        chronometerEl.src= "images/chronometer.png";
        if (resource.cost.size) {
            const costEl = buttonEl.querySelector(".cost");
            resource.cost.forEach((quantity, id) => {
                const itemEl = document.createElement("div");
                itemEl.innerText = `${quantity} ${resources.get(id).name}`;
                costEl.appendChild(itemEl);
            });
        }
        if (resource.consume.size) {
            const consumeEl = buttonEl.querySelector(".consume");
            resource.consume.forEach((quantity, id) => {
                const itemEl = document.createElement("div");
                itemEl.innerText = `- ${quantity} ${resources.get(id).name}`;
                consumeEl.appendChild(itemEl);
            });
        }


        if (resource.produce.size) {
            const produceEl = buttonEl.querySelector(".produce");
            resource.produce.forEach((quantity, id) => {
                const itemEl = document.createElement("div");
                itemEl.innerText = `+ ${quantity} ${resources.get(id).name}`;
                produceEl.appendChild(itemEl);
            });
        } else {
            buttonEl.querySelector(".progress").style.display = "none";
        }

        if (resource.produceTime) {
            const timeEl = buttonEl.querySelector(".time");
            timeEl.appendChild(chronometerEl);
            const time = document.createElement("span");
            time.innerText = `${resource.produceTime / 1000} sec.`;
            timeEl.appendChild(time);
        }

        buttonEl.addEventListener("click", e => {
            resource.craft();
        });
        this.buttonsEl.appendChild(clonedEl);
    }
}