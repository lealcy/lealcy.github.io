import { items } from "./items.js";
import { createFromTemplate, shortNumber } from "./helpers.js";
import ItemBar from "./ItemBar.js";
import MachineContainer from "./MachineContainer.js";
import { message } from "./message.js";

export default class Game {
    constructor() {
        this.lastTimestamp = 0;
        this.itemBar = new ItemBar(document.getElementById("itemBar"), items);
        this.machines = new MachineContainer(document.getElementById("machines"), items);
    }

    run() {
        message("Welcome! Clicking an item will produce it. Hover it to see its name.");
        requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        requestAnimationFrame(this.update.bind(this));
        const frameTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        for (const [id, item] of items) {
            item.produce(frameTime);
            this.itemBar.update(item);
        }

        this.machines.update(frameTime);
    }
}