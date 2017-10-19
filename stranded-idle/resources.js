import Resource from "./Resource.js";


const resourceData = {
    // Resources
    coal: {
        name: "Coal",
        craftable: true,
        cost: {},
        consume: {},
        produce: {},
    },
    stone: {
        name: "Stone",
        craftable: true,
        cost: {},
        consume: {},
        produce: {},
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        cost: {},
        consume: {},
        produce: {},
    },
    copper: {
        name: "Copper Ore",
        craftable: true,
        cost: {},
        consume: {},
        produce: {},
    },

    // Intermediate Products
    stoneBrick: {
        name: "Stone Brick",
        craftable: false,
        cost: {},
        consume: {},
        produce: {},
    },
    ironPlate: {
        name: "Iron Plate",
        craftable: false,
        cost: {},
        consume: {},
        produce: {},
    },

    // Machines
    stoneFurnaceStoneBrick: {
        name: "Stone Furnace (Stone Brick)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 3.5,
        consume: { stone: 2, coal: 0.07875 },
        produce: { stoneBrick: 1 },
    },

    stoneFurnaceIronPlate: {
        name: "Stone Furnace (Iron Plate)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 3.5,
        consume: { iron: 1, coal: 0.07875 },
        produce: { ironPlate: 1 },
    },
};

export const resources = new Map;

for (const res in resourceData) {
    resources.set(res, new Resource(res, resourceData[res]));
}