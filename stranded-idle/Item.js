import { items } from "./items.js";
import ProductionSetting from "./ProductionSetting.js";

export default class Item {
    constructor(id, data) {
        this.id = id;
        this.quantity = data.quantity || 0;
        this.inUse = 0;
        this.visible = data.visible || false;
        this.active = false;
        this.name = data.name;
        this.description = data.description;
        this.craftable = data.craftable || false;
        this.image = data.image;
        this.category = data.category || "none";
        this.requirements = new Set(data.requirements || []);

        this.production = new Map;
        if (data.production !== undefined) {
            for (const itemId in data.production) {
                this.production.set(itemId, new ProductionSetting(data.production[itemId]));
            }
        }

        this.cost = new Map;
        if (data.cost !== undefined) {
            for (const itemId in data.cost) {
                this.cost.set(itemId, data.cost[itemId]);
            }
        }
    }

    attendRequirements() {
        for (const item of this.requirements) {
            if (items.get(item).active) {
                return true;
            }
        }
        return false;
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
            this.quantity++;
            return true;
        }
        return false;
    }

    addMachine(itemId, quantity) {
        if (!this.quantity) {
            return;
        }
        quantity = this.quantity > quantity ? quantity : this.quantity;
        this.quantity -= quantity;
        this.production.get(itemId).quantity += quantity;
        this.inUse += quantity;
    }

    removeMachine(itemId, quantity) {
        const item = this.production.get(itemId);
        if (!item.quantity) {
            return;
        }
        quantity = item.quantity > quantity ? quantity : item.quantity;
        item.quantity -= quantity;
        this.quantity += quantity;
        this.inUse -= quantity;
    }

    produce(frameTime) {
        for (const [id, item] of this.production) {
            item.update(frameTime);
        }
    }
}