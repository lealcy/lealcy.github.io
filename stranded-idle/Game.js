import { items } from "./items.js";
import { createFromTemplate } from "./helpers.js";

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

        items.forEach((item, id) => {
            item.produce(frameTime);
            if (!item.enabled && item.canCraft() && (item.craftable || item.hasMachinery())) {
                this.createButton(item);
                item.enable();
            }

            if (item.enabled) {
                this.updateButton(item);
            }
        });
    }

    createButton(item) {
        const clonedEl = createFromTemplate("buttonTemplate");
        const buttonEl = clonedEl.querySelector(".item");
        buttonEl.id = item.id;
        buttonEl.querySelector(".name").innerText = item.name;
        buttonEl.querySelector(".image").src = `images/${item.image}.png`;
        if (item.cost.size) {
            const costEl = buttonEl.querySelector(".cost");
            item.cost.forEach((quantity, id) => {
                const itemEl = document.createElement("div");
                itemEl.innerText = `${quantity} ${items.get(id).name}`;
                costEl.appendChild(itemEl);
            });
        }

        const machinesEl = buttonEl.querySelector(".machines");
        const chronometerEl = document.createElement("img");
        chronometerEl.src = "images/chronometer.png";
        item.productionTime.forEach((data, machineId) => {
            const machine = items.get(machineId);
            const mClonedEl = createFromTemplate("machineTemplate");
            const machineEl = mClonedEl.querySelector(".machine");
            machineEl.id = `${item.id}_${machineId}`;
            if (!machine.quantity) {
                machineEl.style.display = "none";
            }
            machineEl.querySelector(".image").src = `images/${machine.image}.png`;
            machineEl.querySelector(".name").innerText = machine.name;

            if (machine.consume.size) {
                const consumeEl = machineEl.querySelector(".consume");
                machine.consume.forEach((quantity, id) => {
                    const itemEl = document.createElement("div");
                    itemEl.innerText = `- ${quantity} ${items.get(id).name}`;
                    consumeEl.appendChild(itemEl);
                });
            }

            const produceEl = machineEl.querySelector(".produce");
            item.products.forEach((quantity, id) => {
                const itemEl = document.createElement("div");
                itemEl.innerText = `+ ${quantity} ${items.get(id).name}`;
                produceEl.appendChild(itemEl);
            });

            const timeEl = machineEl.querySelector(".time");
            timeEl.appendChild(chronometerEl);
            const time = document.createElement("span");
            time.innerText = `${data.productionTime / 1000} sec.`;
            timeEl.appendChild(time);

            machineEl.addEventListener("click", e => {
                e.stopPropagation();
                item.addMachine(machine);
                return false;
            });

            machinesEl.appendChild(mClonedEl);

        });
        buttonEl.addEventListener("click", e => {
            e.stopPropagation();
            item.handcraft();
            return false;
        });
        this.buttonsEl.appendChild(clonedEl);
    }

    updateButton(item) {
        const itemEl = document.getElementById(item.id);
        const quantity = item.quantity > 0 && item.quantity < 1 ? "< 1" : item.quantity | 0;
        itemEl.querySelector(".quantity").innerText = quantity;
        item.productionTime.forEach((data, machineId) => {
            //const machine = items.get(machineId);
            const machineEl = document.getElementById(`${item.id}_${machineId}`);
            if (items.get(machineId).quantity) {
                machineEl.style.display = "flex";
            }
            machineEl.querySelector(".quantity").innerText = data.quantity;
            let progress = 0;
            if (data.productionTime) {
                progress = data.elapsedTime / data.productionTime;
            }
            machineEl.querySelector(".progress").value = progress;
        });

    };
}