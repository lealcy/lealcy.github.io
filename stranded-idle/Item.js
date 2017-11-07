import { items } from "./items.js";
import ProductionSetting from "./ProductionSetting.js";

export default class Item {
    constructor(id, data) {
        this.id = id;
        this.quantity = 0;
        this.visible = data.visible || false;
        this.active = false;
        this.name = data.name;
        this.description = data.description;
        this.craftable = data.craftable || false;
        this.image = data.image;
        this.category = data.category || "none";

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
    }

    removeMachine(itemId, quantity) {
        const item = this.production.get(itemId);
        if (!item.quantity) {
            return;
        }
        quantity = item.quantity > quantity ? quantity : item.quantity;
        item.quantity -= quantity;
        this.quantity += quantity;
    }

    produce(frameTime) {
        for (const [id, item] of this.production) {
            item.update(frameTime);
        }
    }

    /*    addMachine(machine) {
            if (machine.quantity >= 1) {
                machine.quantity--;
                this.productionTime.get(machine.id).quantity++;
            }
        }
    
        addAllMachines(machine) {
            if (machine.quantity) {
                const quantity = machine.quantity;
                machine.quantity = 0;
                this.productionTime.get(machine.id).quantity += quantity;
            }
        }
    
        removeMachine(machine) {
            if (this.productionTime.get(machine.id).quantity) {
                this.productionTime.get(machine.id).quantity--;
                machine.quantity++;
            }
        }
    
        removeAllMachines(machine) {
            if (this.productionTime.get(machine.id).quantity) {
                const quantity = this.productionTime.get(machine.id).quantity;
                this.productionTime.get(machine.id).quantity = 0;
                machine.quantity += quantity;
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
    
        hasMachinery() {
            let hasMachinery = false;
            this.productionTime.forEach((quantity, id) => {
                if (items.get(id).quantity) {
                    hasMachinery = true;
                }
            });
    
            return hasMachinery;
        }*/
}