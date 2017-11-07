import { items } from "./items.js";

const WAITING = 1;
const WORKING = 2;

export default class ProductionSetting {
    constructor(data) {
        this.time = data.time;
        this.quantity = 0;
        this.elapsedTime = 0;
        this.state = WAITING;

        this.consume = new Map;
        for (const itemId in data.consume) {
            this.consume.set(itemId, data.consume[itemId]);
        }

        this.produce = new Map;
        for (const itemId in data.produce) {
            this.produce.set(itemId, data.produce[itemId]);
        }

    }

    update(frameTime) {
        if (!this.quantity) {
            return;
        }
        if (this.state === WAITING) {
            for (const [id, quantity] of this.consume) {
                if (items.get(id).quantity < quantity) {
                    return;
                }
            }
            for (const [id, quantity] of this.consume) {
                items.get(id).quantity -= quantity;
            }
            this.state = WORKING;
        } else if (this.state === WORKING) {
            if (this.elapsedTime >= this.time) {
                for (const [id, quantity] of this.produce) {
                    items.get(id).quantity += quantity;
                }
                this.elapsedTime = 0;
                this.state = WAITING;
            } else {
                this.elapsedTime += frameTime;
            }
        }

    }

    resourcesActive() {
        for (const [id, quantity] of this.consume) {
            if (!items.get(id).active) {
                return false;
            }
            return true;
        }
    }
}