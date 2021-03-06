import { items } from "./items.js";

const WAITING = 1;
const WORKING = 2;

export default class ProductionSetting {
    constructor(data) {
        this.time = data.time;
        this.quantity = 0;
        this.elapsedTime = 0;
        this.state = WAITING;
        this.currentProduction = 0;

        this.consume = new Map;
        for (const itemId in data.consume) {
            this.consume.set(itemId, data.consume[itemId]);
        }

        this.produce = new Map;
        for (const itemId in data.produce) {
            this.produce.set(itemId, data.produce[itemId]);
        }

    }

    canProduce() {
        for (const [id, quantity] of this.consume) {
            if (items.get(id).quantity < quantity) {
                return false;
            }
        }
        return true;
    }

    update(frameTime) {
        if (!this.quantity) {
            this.state = WAITING;
            this.elapsedTime = 0;
            return;
        }
        if (this.state === WAITING) {
            this.currentProduction = 0;
            for (let i = 0; i < this.quantity; i++) {
                if (this.canProduce()) {
                    for (const [id, quantity] of this.consume) {
                        items.get(id).quantity -= quantity
                    }
                    this.currentProduction++;
                } else {
                    break;
                }
            }
            if (this.currentProduction) {
                this.state = WORKING;
            }
        } else if (this.state === WORKING) {
            if (this.elapsedTime >= this.time) {
                if (this.currentProduction > this.quantity) {
                    this.currentProduction = this.quantity;
                }
                for (const [id, quantity] of this.produce) {
                    const item = items.get(id);
                    item.visible = true;
                    item.quantity += quantity * this.currentProduction;
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
        }
        return true;
    }
}