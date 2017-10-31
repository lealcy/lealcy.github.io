import { createFromTemplate } from "./helpers.js";

export default class MachineContainer {
    constructor(containerEl, items) {
        this.items = items;
        this.machines = new Map;
        this.containerEl = containerEl;
        for (const [itemId, item] of items) {
            if (item.production.size) {
                for (const [machineId, machineData] of item.production) {
                    const id = `machine_${itemId}_${machineId}`;
                    const machineEl = createFromTemplate("machineTemplate");
                    machineEl.id = id;
                    machineEl.querySelector(".display > .image > img").src = `images/${item.image}.png`;
                    this.populateItems(machineEl.querySelector(".display > .consume"), machineData.consume);
                    this.populateItems(machineEl.querySelector(".display > .produce"), machineData.produce);
                    machineEl.querySelector(".work > .produceTime > .time").innerText = `${machineData.time / 1000}s`;
                    containerEl.appendChild(machineEl);
                }
            }
        }
    }

    populateItems(el, data) {
        console.log(data);
        for (const [id, quantity] of data) {
            const itemEl = createFromTemplate("machineItemTemplate");
            itemEl.querySelector(".image").src = `images/${this.items.get(id).image}.png`;
            itemEl.querySelector(".quantity").innerText = quantity;
            el.appendChild(itemEl);
        }

    }
}