
export default class ProductionSetting {
    constructor(data) {
        this.time = data.time;

        this.consume = new Map;
        for (const itemId in data.consume) {
            this.consume.set(itemId, data.consume[itemId]);
        }

        this.produce = new Map;
        for (const itemId in data.produce) {
            this.produce.set(itemId, data.produce[itemId]);
        }

    }
}