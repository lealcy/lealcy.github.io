import Item from "./Item.js";

const itemData = {
    // Debug
    giftOfTheGods: {
        name: "Gift of the Gods",
        craftable: true,
        description: "For debug purposes.",
        image: "electricity",
        products: {
            coal: 10000, iron: 10000, copper: 10000, stone: 10000,
            ironPlate: 10000, copperPlate: 10000, copperCable: 10000,
            ironGear: 10000, pipe: 10000, stoneFurnace: 10000,
            electronicCircuit: 10000, burnerMiningDrill: 10000, assembler1: 10000,
            assembler2: 10000, waterPump: 10000, boiler: 10000, steamEngine: 10000,
        },
    },

    // Resources
    coal: {
        name: "Coal",
        description: "Power machines and produce energy.",
        image: "coal",
        craftable: true,
        productionTime: { burnerMiningDrill: 3571.4 },
        products: { coal: 1 },
    },
    stone: {
        name: "Stone",
        description: "Craft furnaces and bricks.",
        image: "stone",
        craftable: true,
        productionTime: { burnerMiningDrill: 2721 },
        products: { stone: 1 },
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        description: "Melt it into plates.",
        products: { iron: 1 },
        image: "iron",
        productionTime: { burnerMiningDrill: 3571.4 },
    },
    copper: {
        name: "Copper Ore",
        description: "Melt it into plates.",
        craftable: true,
        products: { copper: 1 },
        image: "copper",
        productionTime: { burnerMiningDrill: 3571.4 },
    },

    // Electricity
    electricity: {
        name: "Electricity",
        image: "electricity",
        description: "Power machines.",
        products: { electricity: 1 },
        productionTime: { steamEngine: 13 },
    },

    // Liquids
    water: {
        name: "Water",
        description: "Is a liquid, fishes pee on it.",
        image: "water",
        products: { water: 120 },
        productionTime: { waterPump: 100 }
    },

    // Gases
    steam: {
        name: "Steam",
        description: "If you liked it, then you should have put a Steam Engine on it.",
        image: "steam",
        cost: { water: 6 },
        products: { steam: 6 },
        productionTime: { boiler: 100 },
    },

    // Intermediate Products
    stoneBrick: {
        name: "Stone Brick",
        description: "Good heat insulator.",
        image: "stoneBrick",
        cost: { stone: 2 },
        productionTime: { stoneFurnace: 3571.4, },
        products: { stoneBrick: 1 }
    },
    ironPlate: {
        name: "Iron Plate",
        description: "You'll need a lot of it.",
        image: "ironPlate",
        products: { ironPlate: 1 },
        cost: { iron: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    copperPlate: {
        name: "Copper Plate",
        description: "You will never get enough of it later.",
        image: "copperPlate",
        products: { copperPlate: 1 },
        cost: { copper: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    steelPlate: {
        name: "Steel Plate",
        description: "From Electric Furnaces to Nuclear Power.",
        image: "steelPlate",
        products: { steelPlate: 1 },
        cost: { ironPlate: 5 },
        productionTime: { stoneFurnace: 17543.8, },
    },
    ironGear: {
        name: "Iron Gear",
        description: "If it have moving parts, you'll need it.",
        image: "ironGear",
        craftable: true,
        cost: { ironPlate: 2 },
        products: { ironGear: 1 },
        productionTime: { assembler1: 750 },
    },
    copperCable: {
        name: "Copper Cable",
        description: "Required in electric components.",
        image: "copperCable",
        craftable: true,
        cost: { copperPlate: 1 },
        products: { copperCable: 1 },
        productionTime: { assembler1: 750 },
    },
    electronicCircuit: {
        name: "Electronic Circuit",
        description: "Primary ingredient in automation.",
        image: "electronicCircuit",
        craftable: true,
        cost: { copperCable: 3, ironPlate: 1 },
        products: { electronicCircuit: 1 },
        productionTime: { assembler1: 750 },
    },

    // Machinery
    pipe: {
        name: "Pipe",
        description: "Contain liquids and gases.",
        image: "pipe",
        craftable: true,
        cost: { ironPlate: 1 },
        productionTime: { assembler1: 750 },
        products: { pipe: 1 },
    },

    // Machines
    stoneFurnace: {
        name: "Stone Furnace",
        description: "Smelt things in other things, cosumes coal.",
        image: "stoneFurnace",
        craftable: true,
        cost: { stone: 5 },
        consume: { coal: 0.08035 },
        products: { stoneFurnace: 1 },
        productionTime: { assembler1: 750 },
    },
    burnerMiningDrill: {
        name: "Burner Mining Drill",
        description: "Disregard taps, adquire resource.",
        image: "burnerMiningDrill",
        craftable: true,
        cost: { ironGear: 3, ironPlate: 3, stoneFurnace: 1 },
        consume: { coal: 0.14285 },
        image: "burnerMiningDrill",
        category: "miner",
        products: { burnerMiningDrill: 1 },
        productionTime: { assembler2: 750 },
    },
    assembler1: {
        name: "Assembler 1",
        description: "Produce items that require up to two different ingredients.",
        craftable: true,
        image: "assembler1",
        consume: { electricity: 70 },
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9 },
        products: { assembler1: 1 },
        productionTime: { assembler2: 750 },
    },
    assembler2: {
        name: "Assembler 2",
        description: "Craft items that use three or four ingredients of distinct types.",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9, assembler1: 1 },
        image: "assembler2",
        consume: { electricity: 100 },
        products: { assembler2: 1 },
        productionTime: { assembler2: 750 },
    },
    waterPump: {
        name: "Water Pump",
        description: "Pumps water from the ground.",
        craftable: true,
        cost: { electronicCircuit: 2, ironGear: 1, pipe: 1 },
        image: "waterPump",
        products: { waterPump: 1 },
        productionTime: { assembler2: 750 },
    },
    boiler: {
        name: "Boiler",
        description: "Turns Water to Steam, burns Coal.",
        craftable: true,
        cost: { pipe: 4, stoneFurnace: 1 },
        image: "boiler",
        products: { boiler: 1 },
        productionTime: { assembler1: 750 },
        consume: { coal: 0.125 },
    },
    steamEngine: {
        name: "Steam Engine",
        description: "Generates Electricity.",
        image: "steamEngine",
        craftable: true,
        cost: { ironGear: 8, ironPlate: 10, pipe: 5 },
        products: { steamEngine: 1 },
        consume: { steam: 6 },
        productionTime: { assembler2: 750 },
    }


};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}