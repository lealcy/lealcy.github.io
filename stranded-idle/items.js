import Item from "./Item.js";

const itemData = {
    // Debug
    /*giftOfTheGods: {
        name: "Gift Of The Gods",
        craftable: true,
        description: "For debugging purposes.",
        image: "giftOfTheGods",
        type: "resource",
    },*/

    // Resources
    coal: {
        name: "Coal",
        description: "Power machines and produce power.",
        image: "coal",
        craftable: true,
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        //products: { coal: 1 },
        category: "Resources",
        type: "resource",
    },
    stone: {
        name: "Stone",
        description: "Craft furnaces and bricks.",
        image: "stone",
        craftable: true,
        //productionTime: { burnerMiner: 2721, electricMiner: 1538.4, },
        //products: { stone: 1 },
        category: "Resources",
        type: "resource",
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        description: "Melt it into plates.",
        //products: { iron: 1 },
        image: "iron",
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        category: "Resources",
        type: "resource",
    },
    copper: {
        name: "Copper Ore",
        description: "Melt it into plates.",
        craftable: true,
        //products: { copper: 1 },
        image: "copper",
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        category: "Resources",
        type: "resource",
    },

    // Electricity
    /*electricity: {
        name: "Electricity",
        image: "electricity",
        description: "Power machines.",
        products: { electricity: 10 },
        productionTime: { steamEngine: 100 },
    },
 
    // Liquids
    water: {
        name: "Water",
        description: "Is a liquid, fishes pee on it.",
        image: "water",
        products: { water: 40 },
        productionTime: { waterPump: 100 }
    },
    petroleum: {
        name: "Petroleum",
        description: "Black gold.",
        image: "petroleum",
        products: { petroleum: 54 },
        productionTime: { oilPump: 1000 },
    },
 
    // Gases
    steam: {
        name: "Steam",
        description: "If you liked it, then you should have put a Steam Engine on it.",
        image: "steam",
        cost: { water: 2 },
        products: { steam: 2 },
        productionTime: { boiler: 100 },
    },
 
    // Intermediate Products
    stoneBrick: {
        name: "Brick",
        description: "Good heat insulator.",
        image: "stoneBrick",
        cost: { stone: 2 },
        productionTime: { stoneFurnace: 3571.4, },
        products: { stoneBrick: 1 }
    },
    ironPlate: {
        name: "Iron Bar",
        description: "You'll need a lot of it.",
        image: "ironPlate",
        products: { ironPlate: 1 },
        cost: { iron: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    copperPlate: {
        name: "Copper Bar",
        description: "You will never get enough of it later.",
        image: "copperPlate",
        products: { copperPlate: 1 },
        cost: { copper: 1 },
        productionTime: { stoneFurnace: 3571.4, },
    },
    steelPlate: {
        name: "Steel Bar",
        description: "From Electric Furnaces to Nuclear Power.",
        image: "steelPlate",
        products: { steelPlate: 1 },
        cost: { ironPlate: 5 },
        productionTime: { stoneFurnace: 17543.8, },
    },
    ironGear: {
        name: "Gear Wheel",
        description: "If it have moving parts, you'll need it.",
        image: "ironGear",
        craftable: true,
        cost: { ironPlate: 2 },
        products: { ironGear: 1 },
        productionTime: { assembler1: 750 },
    },
    copperCable: {
        name: "Cable",
        description: "Required in electric components.",
        image: "copperCable",
        craftable: true,
        cost: { copperPlate: 1 },
        products: { copperCable: 1 },
        productionTime: { assembler1: 750 },
    },
    electronicCircuit: {
        name: "Circuit Board",
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
    */stoneFurnace: {
        name: "Foundry",
        description: "Smelt things in other things, cosumes coal.",
        image: "stoneFurnace",
        craftable: true,
        cost: { stone: 5 },
        consume: { coal: 0.08035 },
        category: "Machines",
        //products: { stoneFurnace: 1 },
        //productionTime: { assembler1: 750 },
    },/*
    burnerMiner: {
        name: "Burner Drill",
        description: "Disregard taps, adquire resource.",
        image: "burnerMiningDrill",
        craftable: true,
        cost: { ironGear: 3, ironPlate: 3, stoneFurnace: 1 },
        consume: { coal: 0.14285 },
        image: "burnerMiningDrill",
        category: "miner",
        products: { burnerMiner: 1 },
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
        name: "Steam Generator",
        description: "Generates Electricity.",
        image: "steamEngine",
        craftable: true,
        cost: { ironGear: 8, ironPlate: 10, pipe: 5 },
        products: { steamEngine: 1 },
        consume: { steam: 1 },
        productionTime: { assembler2: 750 },
    },
    electricMiner: {
        name: "Electric Mining Drill",
        description: "Automatic resource extractor.",
        image: "electricMiner",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 10, },
        products: { electricMiner: 1 },
        consume: { electricity: 90 },
        productionTime: { assembler2: 750 },
    },
    oilPump: {
        name: "Oil Pump",
        description: "Pumps oil from the ground.",
        image: "oilPump",
        craftable: true,
        cost: { electronicCircuit: 5, ironGear: 10, pipe: 10, },
        products: { oilPump: 1 },
        consume: { electricity: 90 },
        productionTime: { assembler2: 750 },
    },*/
};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}

/*for (const [id, data] of items) {
    if (id === "giftOfTheGods") {
        continue;
    }
    items.get("giftOfTheGods").products.set(id, 10000);
}*/
