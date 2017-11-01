import { createFromTemplate } from "./helpers.js";

export default class MachineContainer {
    constructor(containerEl, items) {
        this.items = items;
        this.machines = new Map;
        this.containerEl = containerEl;
        for (const [itemId, item] of items) {
            if (item.production.size) {
                const id = `machine_${itemId}`;
                const machineEl = createFromTemplate("machineTemplate");
                machineEl.id = id;
                const resourceEl = createFromTemplate("resourceTemplate");
                resourceEl.querySelector(".image").src = `images/${item.image}.png`;
                resourceEl.querySelector(".name").innerText = item.name;
                machineEl.querySelector(".display").appendChild(resourceEl);
                const productionLinesEl = machineEl.querySelector(".productionLines");
                for (const [machineId, machineData] of item.production) {
                    const productionLineEl = createFromTemplate("machineProductionLine");
                    productionLineEl.id = `${id}_${machineId}`;
                    this.populateItems(productionLineEl.querySelector(".consume"), machineData.consume);
                    this.populateItems(productionLineEl.querySelector(".produce"), machineData.produce);
                    productionLineEl.querySelector(".work > .produceTime > .time").innerText = `${machineData.time / 1000}s`;
                    productionLinesEl.appendChild(productionLineEl);
                }
                containerEl.appendChild(machineEl);
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