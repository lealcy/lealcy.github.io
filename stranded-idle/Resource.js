import { resources } from "./resources.js";

export default class Resource {
    constructor(id, data) {
        this.id = id;
        this.quantity = 0;
        this.enabled = false;
        this.name = data.name;
        this.produceTime = data.produceTime || 1;
        this.craftable = data.craftable || false;
        this.operationTime = 0;

        this.cost = new Map;
        if (data.cost !== undefined) {
            for (const res in data.cost) {
                this.cost.set(res, data.cost[res]);
            }
        }

        this.produce = new Map;
        if (data.produce !== undefined) {
            for (const res in data.produce) {
                this.produce.set(res, data.produce[res]);
            }
        }

        this.consume = new Map;
        if (data.consume !== undefined) {
            for (const res in data.consume) {
                this.consume.set(res, data.consume[res]);
            }
        }
    }

    canCraft() {
        for (const [id, quantity] of this.cost) {
            if (resources.get(id).quantity < quantity) {
                return false;
            }
        }
        return true;
    }

    craft() {
        if (this.craftable && this.canCraft()) {
            for (const [id, quantity] of this.cost) {
                resources.get(id).quantity -= quantity;
            }
            this.quantity += 1;
        }
    }

    canProduce() {
        for (const [id, quantity] of this.consume) {
            if (resources.get(id).quantity < quantity) {
                return false;
            }
        }
        return true;
    }

    operate(frameTime) {
        if (this.quantity) {
            if (this.quantity < 1 || this.operationTime < this.produceTime) {
                this.operationTime += frameTime;
                return;
            }
            while (this.operationTime >= this.produceTime) {
                this.operationTime -= this.produceTime;
                for (let i = 0; i < this.quantity; i++) {
                    if (this.canProduce()) {
                        for (const [id, quantity] of this.consume) {
                            resources.get(id).quantity -= quantity;
                        }
                        for (const [id, quantity] of this.produce) {
                            resources.get(id).quantity += quantity;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }
}