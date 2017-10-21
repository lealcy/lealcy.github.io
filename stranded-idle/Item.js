import { items } from "./items.js";

export default class Item {
    constructor(id, data) {
        this.id = id;
        this.quantity = 0;
        this._enabled = false;
        this.name = data.name;
        this.craftable = data.craftable || false;
        this.image = data.image;
        this.productionFactor = data.productionFactor || 1;

        this.cost = new Map;
        if (data.cost !== undefined) {
            for (const itemId in data.cost) {
                this.cost.set(itemId, data.cost[itemId]);
            }
        }

        this.consume = new Map;
        if (data.consume !== undefined) {
            for (const itemId in data.consume) {
                this.consume.set(itemId, data.consume[itemId]);
            }
        }

        this.products = new Map;
        if (data.products !== undefined) {
            for (const itemId in data.products) {
                this.products.set(itemId, data.products[itemId]);
            }
        }

        this.productionTime = new Map;
        if (data.productionTime !== undefined) {
            for (const itemId in data.productionTime) {
                this.productionTime.set(itemId, { quantity: 0, productionTime: data.productionTime[itemId], elapsedTime: 0 });
            }
        }

    }

    get enabled() {
        return this._enabled;
    }

    enable() {
        this._enabled = true;
    }

    canCraft() {
        for (const [id, quantity] of this.cost) {
            if (items.get(id).quantity < quantity) {
                return false;
            }
        }
        return true;
    }

    handcraft() {
        if (this.craftable) {
            this.craft();
        }
    }

    craft() {
        if (this.canCraft()) {
            this.cost.forEach((quantity, id) => {
                items.get(id).quantity -= quantity;
            });
            this.products.forEach((quantity, id) => {
                items.get(id).quantity += quantity;
            });
            return true;
        }
        return false;
    }

    addMachine(machine) {
        if (machine.quantity >= 1) {
            machine.quantity--;
            this.productionTime.get(machine.id).quantity++;
        }
    }

    canOperate() {
        let canOperate = true;
        this.consume.forEach((quantity, id) => {
            if (items.get(id).quantity < quantity) {
                canOperate = false;
            }
        });
        return canOperate;
    }

    operate(item) {
        if (this.canOperate() && item.craft()) {
            this.consume.forEach((quantity, id) => {
                items.get(id).quantity -= quantity;
            });
            return true;
        }
        return false;
    }

    produce(frameTime) {
        this.productionTime.forEach((data, machineId) => {
            if (data.quantity >= 1 && this.canCraft()) {
                const machine = items.get(machineId);
                if (machine.canOperate()) {
                    data.elapsedTime += frameTime;
                    while (data.elapsedTime >= data.productionTime) {
                        for (let i = 0; i < data.quantity; i++) {
                            if (!machine.operate(this)) {
                                break;
                            }
                        }
                        data.elapsedTime -= data.productionTime;
                    }
                } else {
                    data.elapsedTime = 0;
                }
            } else {
                data.elapsedTime = 0;
            }
        });
    }
}