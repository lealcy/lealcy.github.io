import Item from "./Item.js";

const itemData = {
    // Resources
    coal: {
        name: "Coal",
        image: "coal",
        craftable: true,
        productionTime: { burnerMiningDrill: 3571.4 },
        products: { coal: 1 },
    },
    stone: {
        name: "Stone",
        image: "stone",
        craftable: true,
        productionTime: { burnerMiningDrill: 2721 },
        products: { stone: 1 },
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        products: { iron: 1 },
        image: "iron",
        productionTime: { burnerMiningDrill: 3571.4 },
    },
    copper: {
        name: "Copper Ore",
        craftable: true,
        products: { copper: 1 },
        image: "copper",
        productionTime: { burnerMiningDrill: 3571.4 },
    },

    // Liquid
    water: {
        name: "Water",
        image: "water",
        products: { water: 1 },
        productionTime: { waterPump: 25 }
    },
    steam: {
        name: "Steam",
        image: "steam",
        cost: { water: 2 },
        products: { steam: 2 },
        productionTime: { boiler: 5 },
    },

    // Intermediate Products
    stoneBrick: {
        name: "Stone Brick",
        image: "stoneBrick",
        cost: { stone: 2 },
        productionTime: { stoneFurnace: 3571.4, },
        products: { stoneBrick: 1 }
    },
    ironPlate: {
        name: "Iron Plate",
        image: "ironPlate",
        products: { ironPlate: 1 },
        cost: { iron: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    copperPlate: {
        name: "Copper Plate",
        image: "copperPlate",
        products: { copperPlate: 1 },
        cost: { copper: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    steelPlate: {
        name: "Steel Plate",
        image: "steelPlate",
        products: { steelPlate: 1 },
        cost: { ironPlate: 5 },
        productionTime: { stoneFurnace: 17543.8, },
    },
    ironGear: {
        name: "Iron Gear",
        image: "ironGear",
        craftable: true,
        cost: { ironPlate: 2 },
        products: { ironGear: 1 },
        productionTime: { assembler1: 750 },
    },
    copperCable: {
        name: "Copper Cable",
        image: "copperCable",
        craftable: true,
        cost: { copperPlate: 1 },
        products: { copperCable: 1 },
        productionTime: { assembler1: 750 },
    },
    eletronicCircuit: {
        name: "Eletronic Circuit",
        image: "eletronicCircuit",
        craftable: true,
        cost: { copperCable: 3, ironPlate: 1 },
        products: { eletronicCircuit: 1 },
        productionTime: { assembler1: 750 },
    },

    // Machinery
    pipe: {
        name: "Pipe",
        image: "pipe",
        craftable: true,
        cost: { ironPlate: 1 },
        productionTime: { assembler1: 750 },
        products: { pipe: 1 },
    },

    // Machines
    stoneFurnace: {
        name: "Stone Furnace",
        craftable: true,
        cost: { stone: 5 },
        image: "stoneFurnace",
        consume: { coal: 0.08035 },
        products: { stoneFurnace: 1 },
        productionTime: { assembler1: 750 },
    },
    burnerMiningDrill: {
        name: "Burner Mining Drill",
        image: "burnerMiningDrill",
        craftable: true,
        cost: { ironGear: 3, ironPlate: 3, stoneFurnace: 1 },
        consume: { coal: 0.14285 },
        image: "burnerMiningDrill",
        category: "miner",
        products: { burnerMiningDrill: 1 },
        productionTime: { assembler1: 750 },
    },
    assembler1: {
        name: "Assembler 1",
        craftable: true,
        cost: { eletronicCircuit: 3, ironGear: 5, ironPlate: 9 },
        image: "assembler1",
        products: { assembler1: 1 },
        productionTime: { assembler1: 750 },
    },
    assembler2: {
        name: "Assembler 2",
        craftable: true,
        cost: { eletronicCircuit: 3, ironGear: 5, ironPlate: 9, assembler1: 1 },
        image: "assembler2",
        products: { assembler2: 1 },
        productionTime: { assembler2: 750 },
    },
    waterPump: {
        name: "Water Pump",
        craftable: true,
        cost: { eletronicCircuit: 2, ironGear: 1, pipe: 1 },
        image: "waterPump",
        products: { waterPump: 1 },
        productionTime: { assembler2: 750 },
    },
    boiler: {
        name: "Boiler",
        craftable: true,
        cost: { pipe: 4, stoneFurnace: 1 },
        image: "boiler",
        products: { boiler: 1 },
        productionTime: { assembler1: 750 },
        consume: { coal: 0.125 },
    },
    steamEngine: {
        name: "Steam Engine",
        image: "steamEngine",
        craftable: true,
        cost: { ironGear: 8, ironPlate: 10, pipe: 5 },
        products: { steamEngine: 1 },
        consume: { steam: 1 },
        productionTime: { assembler2: 750 },
    }


};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}