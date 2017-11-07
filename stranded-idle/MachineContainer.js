import { createFromTemplate } from "./helpers.js";

export default class MachineContainer {
    constructor(containerEl, items) {
        this.items = items;
        this.machines = new Map;
        this.containerEl = containerEl;
        for (const [itemId, item] of items) {
            if (item.production.size) {
                const machine = {};
                machine.item = item;
                machine.element = createFromTemplate("machineTemplate");
                machine.element.id = `machine_${itemId}`;
                machine.element.style.display = "none";
                const resourceEl = createFromTemplate("resourceTemplate");
                machine.quantityEl = resourceEl.querySelector(".quantity");
                resourceEl.querySelector(".image").src = `images/${item.image}.png`;
                resourceEl.querySelector(".name").innerText = item.name;
                machine.element.querySelector(".display").appendChild(resourceEl);
                const productionLinesEl = machine.element.querySelector(".productionLines");
                machine.production = new Map;
                for (const [machineId, machineData] of item.production) {
                    const production = {};
                    production.item = items.get(machineId);
                    production.element = createFromTemplate("machineProductionLine");
                    production.element.id = `${machine.element.id}_${machineId}`;
                    production.element.style.display = "none";
                    production.progressEl = production.element.querySelector(".progress");
                    production.quantityEl = production.element.querySelector(".quantity");
                    this.populateItems(production.element.querySelector(".consume"), machineData.consume);
                    this.populateItems(production.element.querySelector(".produce"), machineData.produce);
                    production.element.querySelector(".work > .produceTime > .time").innerText = `${machineData.time / 1000}s`;
                    production.element.querySelector(".removeAll").addEventListener(
                        "click",
                        e => machine.item.removeMachine(machineId, machine.item.production.get(machineId).quantity)
                    );
                    production.element.querySelector(".remove100").addEventListener(
                        "click",
                        e => machine.item.removeMachine(machineId, 100)
                    );
                    production.element.querySelector(".remove10").addEventListener(
                        "click",
                        e => machine.item.removeMachine(machineId, 10)
                    );
                    production.element.querySelector(".remove1").addEventListener(
                        "click",
                        e => machine.item.removeMachine(machineId, 1)
                    );
                    production.element.querySelector(".add1").addEventListener(
                        "click",
                        e => machine.item.addMachine(machineId, 1)
                    );
                    production.element.querySelector(".add10").addEventListener(
                        "click",
                        e => machine.item.addMachine(machineId, 10)
                    );
                    production.element.querySelector(".add100").addEventListener(
                        "click",
                        e => machine.item.addMachine(machineId, 100)
                    );
                    production.element.querySelector(".addAll").addEventListener(
                        "click",
                        e => machine.item.addMachine(machineId, machine.item.quantity)
                    );
                    productionLinesEl.appendChild(production.element);
                    machine.production.set(machineId, production);
                }
                this.machines.set(itemId, machine);
                containerEl.appendChild(machine.element);
            }
        }
    }

    update(frameTime) {
        for (const [machineId, machine] of this.machines) {
            if (machine.item.quantity) {
                machine.element.style.display = "block";
            }
            machine.quantityEl.innerText = `${machine.item.quantity} / ${machine.item.quantity + machine.item.inUse}`;
            for (const [productionId, production] of machine.production) {
                const machineSetting = machine.item.production.get(productionId);
                if (machineSetting.resourcesActive()) {
                    production.element.style.display = "block";
                }
                production.quantityEl.innerText = machineSetting.quantity;
                production.progressEl.value = machineSetting.time ? machineSetting.elapsedTime / machineSetting.time : 1.0;
            }
        }
    }

    populateItems(el, data) {
        for (const [id, quantity] of data) {
            const itemEl = createFromTemplate("machineItemTemplate");
            itemEl.querySelector(".image").src = `images/${this.items.get(id).image}.png`;
            itemEl.querySelector(".quantity").innerText = quantity;
            el.appendChild(itemEl);
        }

    }
}