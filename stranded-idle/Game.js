import { items } from "./items.js";
import { createFromTemplate, shortNumber } from "./helpers.js";
import ItemBar from "./ItemBar.js";

export default class Game {
    constructor(buttonsEl) {
        this.buttonsEl = buttonsEl;
        this.lastTimestamp = 0;
        this.itemBar = new ItemBar(document.getElementById("itemBar"), items);
    }

    run() {
        requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        requestAnimationFrame(this.update.bind(this));
        const frameTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        for (const [id, item] of items) {
            this.itemBar.update(item);

            /*if (!item.visible && item.canCraft()) {
                this.createItem(item);
                item.visible = true;
            }

            if (item.visible) {
                //item.produce(frameTime);
                //this.updateItem(item);
            }*/
        }
    }

    createItem(item) {
        const resourceEl = createFromTemplate("resourceTemplate");
        resourceEl.id = `res_${item.id}`;
        resourceEl.className += item.craftable ? " craftable" : " nonCraftable";
        const resImageEl = resourceEl.querySelector(".image");
        resImageEl.src = `images/${item.image}.png`;
        if (item.craftable) {
            resImageEl.addEventListener("click", e => {
                e.stopPropagation();
                item.handcraft();
            });
        } else {
            resImageEl.style.opacity = 0.5;
        }
        resourceEl.querySelector(".name").innerText = item.name;
        document.getElementById("resources").appendChild(resourceEl);

        if (item.type === "resource") {
            return;
        }

        const itemEl = createFromTemplate("itemTemplate");
        itemEl.id = item.id;
        itemEl.style.opacity = 0.3;
        itemEl.className += item.craftable ? " craftable" : " nonCraftable";
        const imageEl = itemEl.querySelector(".image");
        imageEl.src = `images/${item.image}.png`;
        if (item.craftable) {
            imageEl.addEventListener("click", e => {
                e.stopPropagation();
                item.handcraft();
            });
        }

        itemEl.querySelector(".name").innerText = item.name;
        itemEl.querySelector(".description").innerText = item.description;

        const costEl = itemEl.querySelector(".cost");
        if (item.cost.size) {
            for (const [id, quantity] of item.cost) {
                const resource = items.get(id);
                const newEl = document.createElement("div");
                newEl.id = `cost_${item.id}_${id}`;
                newEl.style.color = resource.quantity < quantity ? "red" : "blue";
                newEl.innerHTML = `${quantity}x<img src="images/${resource.image}.png">`;
                costEl.appendChild(newEl);
            }
        } else {
            costEl.style.display = "none";
        }

        document.getElementById("items").appendChild(itemEl);

        const machinesEl = itemEl.querySelector(".machines");
        /*for (const [id, data] of item.productionTime) {
            const machineEl = createFromTemplate("machineTemplate");
            const machine = items.get(id);
            machineEl.id = `productionTime_${item.id}_${id}`;
            machineEl.querySelector(".image").src = `images/${machine.image}.png`;
            machineEl.querySelector(".time").innerText = `${data.productionTime / 1000} sec.`;

            machineEl.querySelector(".removeAll").addEventListener("click", e => {
                e.stopPropagation();
                item.removeAllMachines(machine);
            });
            machineEl.querySelector(".remove1").addEventListener("click", e => {
                e.stopPropagation();
                item.removeMachine(machine);
            });
            machineEl.querySelector(".add1").addEventListener("click", e => {
                e.stopPropagation();
                item.addMachine(machine);
            });
            machineEl.querySelector(".addAll").addEventListener("click", e => {
                e.stopPropagation();
                item.addAllMachines(machine);
            });

            const consumeEl = machineEl.querySelector(".consume");
            for (const [id, quantity] of machine.consume) {
                const consumeItem = items.get(id);
                const newEl = document.createElement("div");
                newEl.id = `consume_${item.id}_${id}`;
                newEl.innerText = `-${quantity} ${consumeItem.name}`;
                consumeEl.appendChild(newEl);
            }

            if (!machine.quantity) {
                machineEl.style.opacity = 0.3;
            }

            machinesEl.appendChild(machineEl);
        }*/
    }

    updateItem(item) {
        const resourceEl = document.getElementById(`res_${item.id}`);
        const itemEl = document.getElementById(item.id);
        const quantity = item.quantity > 0 && item.quantity < 1 ? "< 1" : shortNumber(item.quantity | 0);
        resourceEl.querySelector(".quantity").innerText = quantity;
        if (item.type === "resource") {
            return;
        }
        if (!item.active) {
            if ((item.craftable && item.canCraft()) || (!item.craftable && item.hasMachinery() && item.canCraft())) {
                item.active = true;
                itemEl.style.opacity = 1.0;
            }
        }
        itemEl.querySelector(".quantity").innerText = quantity;

        for (const [id, quantity] of item.cost) {
            const costEl = document.getElementById(`cost_${item.id}_${id}`);
            costEl.style.color = items.get(id).quantity < quantity ? "red" : "blue";
        }

        /*for (const [id, data] of item.productionTime) {
            const machine = items.get(id);
            const machineEl = document.getElementById(`productionTime_${item.id}_${id}`);

            if (machine.quantity) {
                machineEl.style.opacity = 1.0;
            }

            machineEl.querySelector(".quantity").innerText = shortNumber(data.quantity);
            let progress = 0;
            if (data.productionTime) {
                progress = data.elapsedTime / data.productionTime;
            }
            machineEl.querySelector(".progress").value = progress;
        }*/
    }
}