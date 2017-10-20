import Resource from "./Resource.js";

const resourceData = {
    // Resources
    coal: {
        name: "Coal",
        craftable: true,
    },
    stone: {
        name: "Stone",
        craftable: true,
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
    },
    copper: {
        name: "Copper Ore",
        craftable: true,
    },

    // Intermediate Products
    stoneBrick: {
        name: "Stone Brick",
    },
    ironPlate: {
        name: "Iron Plate",
    },
    copperPlate: {
        name: "Copper Plate",
    },
    steelPlate: {
        name: "Steel Plate",
    },

    // Machines
    stoneFurnaceStoneBrick: {
        name: "Stone Furnace (Stone Brick)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 3500,
        consume: { stone: 2, coal: 0.07875 },
        produce: { stoneBrick: 1 },
    },

    stoneFurnaceIronPlate: {
        name: "Stone Furnace (Iron Plate)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 3500,
        consume: { iron: 1, coal: 0.07875 },
        produce: { ironPlate: 1 },
    },

    stoneFurnaceCopperPlate: {
        name: "Stone Furnace (Copper Plate)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 3500,
        consume: { copper: 1, coal: 0.07875 },
        produce: { copperPlate: 1 },
    },

    stoneFurnaceSteelPlate: {
        name: "Stone Furnace (Steel Plate)",
        craftable: true,
        cost: { stone: 5 },
        produceTime: 17500,
        consume: { ironPlate: 5, coal: 0.39375 },
        produce: { steelPlate: 1 },
    },
};

export const resources = new Map;

for (const res in resourceData) {
    resources.set(res, new Resource(res, resourceData[res]));
}