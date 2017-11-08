import Item from "./Item.js";

const itemData = {
    // Resources
    coal: {
        name: "Coal",
        description: "Power machines and produce power.",
        image: "coal",
        craftable: true,
        visisble: true,
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        category: "resources",
    },
    stone: {
        name: "Stone",
        description: "Craft furnaces and bricks.",
        image: "stone",
        craftable: true,
        visisble: true,
        //productionTime: { burnerMiner: 2721, electricMiner: 1538.4, },
        category: "resources",
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        description: "Melt it into plates.",
        image: "iron",
        visisble: true,
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        category: "resources",
    },
    copper: {
        name: "Copper Ore",
        description: "Melt it into plates.",
        craftable: true,
        image: "copper",
        visisble: true,
        //productionTime: { burnerMiner: 3571.4, electricMiner: 1904.7, },
        category: "resources",
    },

    // Electricity
    electricity: {
        name: "Electricity",
        image: "electricity",
        description: "Power machines.",
        category: "electricity",
        //products: { electricity: 10 },
        //productionTime: { steamEngine: 100 },
    },

    // Liquids
    water: {
        name: "Water",
        description: "Is a liquid, fishes pee on it.",
        image: "water",
        category: "liquids"
        //products: { water: 40 },
        //productionTime: { waterPump: 100 }
    },
    petroleum: {
        name: "Petroleum",
        description: "Black gold.",
        image: "petroleum",
        category: "liquids",
        //products: { petroleum: 54 },
        //productionTime: { oilPump: 1000 },
    },

    // Gases
    steam: {
        name: "Steam",
        description: "If you liked it, then you should have put a Steam Engine on it.",
        image: "steam",
        //cost: { water: 2 },
        category: "gases",
        //products: { steam: 2 },
        //productionTime: { boiler: 100 },
    },

    // Intermediate Products
    stoneBrick: {
        name: "Brick",
        description: "Good heat insulator.",
        image: "stoneBrick",
        cost: { stone: 2 },
        productionTime: { stoneFurnace: 3571.4, },
        products: { stoneBrick: 1 },
        category: "intermediateProducts",
    },
    ironPlate: {
        name: "Iron Bar",
        description: "You'll need a lot of it.",
        image: "ironPlate",
        category: "intermediateProducts"
    },
    copperPlate: {
        name: "Copper Bar",
        description: "You will never get enough of it later.",
        image: "copperPlate",
        category: "intermediateProducts",
    },
    steelPlate: {
        name: "Steel Bar",
        description: "From Electric Furnaces to Nuclear Power.",
        image: "steelPlate",
        category: "intermediateProducts",
    },
    ironGear: {
        name: "Gear Wheel",
        description: "If it have moving parts, you'll need it.",
        image: "ironGear",
        category: "intermediateProducts",
        craftable: true,
        cost: { ironPlate: 2 },
    },
    copperCable: {
        name: "Cable",
        description: "Required in electric components.",
        image: "copperCable",
        category: "intermediateProducts",
        craftable: true,
        cost: { copperPlate: 1 },
    },
    electronicCircuit: {
        name: "Circuit Board",
        description: "Primary ingredient in automation.",
        image: "electronicCircuit",
        category: "intermediateProducts",
        craftable: true,
        cost: { copperCable: 3, ironPlate: 1 },
    },

    // Machinery
    pipe: {
        name: "Pipe",
        description: "Contain liquids and gases.",
        image: "pipe",
        category: "machinery",
        craftable: true,
        cost: { ironPlate: 1 },
    },

    // Machines
    stoneFurnace: {
        name: "Foundry",
        description: "Smelt things in other things, cosumes coal.",
        image: "stoneFurnace",
        craftable: true,
        cost: { stone: 5 },
        category: "machines",
        production: {
            stoneBrick: {
                consume: {
                    stone: 2,
                    coal: 0.08,
                },
                produce: {
                    stoneBrick: 1,
                },
                time: 3500,
            },
            ironPlate: {
                consume: {
                    iron: 1,
                    coal: 0.08,
                },
                produce: {
                    ironPlate: 1,
                },
                time: 3500,
            },
            copperPlate: {
                consume: {
                    copper: 2,
                    coal: 0.08,
                },
                produce: {
                    copperPlate: 1
                },
                time: 3500,
            },
            steelPlate: {
                consume: {
                    ironPlate: 5,
                    coal: 0.4,
                },
                produce: {
                    steelPlate: 1,
                },
                time: 17500,
            },
        }
    },
    burnerMiner: {
        name: "Burner Drill",
        description: "Disregard taps, adquire resource.",
        image: "burnerMiningDrill",
        category: "machines",
        craftable: true,
        cost: { ironGear: 3, ironPlate: 3, stoneFurnace: 1 },
        production: {
            coal: {
                consume: {
                    coal: 0.14,
                },
                produce: {
                    coal: 1,
                },
                time: 3500,
            },
            iron: {
                consume: {
                    coal: 0.14,
                },
                produce: {
                    iron: 1,
                },
                time: 3500,
            },
            copper: {
                consume: {
                    coal: 0.14,
                },
                produce: {
                    copper: 1,
                },
                time: 3500,
            },
            stone: {
                consume: {
                    coal: 0.14,
                },
                produce: {
                    stone: 1,
                },
                time: 2700,
            },

        }
        //productionTime: { assembler2: 750 },
    },
    assembler1: {
        name: "Basic Assembler",
        description: "Produce items that require up to two different ingredients.",
        category: "machines",
        craftable: true,
        image: "assembler1",
        //consume: { electricity: 70 },
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9 },
        production: {
            ironGear: {
                consume: {
                    ironPlate: 2,
                },
                produce: {
                    ironGear: 1
                },
                time: 750,
            },
            copperCable: {
                consume: {
                    copperPlate: 1,
                },
                produce: {
                    copperCable: 1,
                },
                time: 750,
            },
            electronicCircuit: {
                consume: {
                    copperCable: 3,
                    ironPlate: 1,
                },
                produce: {
                    electronicCircuit: 1
                },
                time: 750,
            },
            pipe: {
                consume: {
                    ironPlate: 1,
                },
                produce: {
                    pipe: 1
                },
                time: 750,
            },
            stoneFurnace: {
                consume: {
                    stone: 5,
                },
                produce: {
                    stoneFurnace: 1,
                },
                time: 750,
            },
            boiler: {
                consume: {
                    pipe: 4,
                    stoneFurnace: 1,
                },
                produce: {
                    boiler: 1,
                },
                time: 750,
            }
        }
    },
    assembler2: {
        name: "Assembler 2",
        description: "Craft items that use three or four ingredients of distinct types.",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9, assembler1: 1 },
        image: "assembler2",
        category: "machines",
        production: {
            assembler1: {
                consume: {
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 9,
                },
                produce: {
                    assembler1: 1,
                },
                time: 750,
            },
            burnerMiner: {
                consume: {
                    ironGear: 3,
                    ironPlate: 3,
                    stoneFurnace: 1,
                },
                produce: {
                    burnerMiner: 1,
                },
                time: 750,
            },
            assembler2: {
                consume: {
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 9,
                    assembler1: 1,
                },
                produce: {
                    assembler2: 1,
                },
                time: 750,
            },
            waterPump: {
                consume: {
                    electronicCircuit: 2,
                    ironGear: 1,
                    pipe: 1,
                },
                produce: {
                    waterPump: 1,
                },
                time: 750
            },
            steamEngine: {
                consume: {
                    ironGear: 8,
                    ironPlate: 10,
                    pipe: 5,
                },
                produce: {
                    steamEngine: 1,
                },
                time: 750,
            },
            electricMiner: {
                consume: {
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 10,
                },
                produce: {
                    electricMiner: 1,
                },
                time: 750,
            },
            oilPump: {
                consume: {
                    electronicCircuit: 5,
                    ironGear: 10,
                    pipe: 10,
                },
                produce: {
                    oilPump: 1,
                },
                time: 750,
            }
        }
        //consume: { electricity: 100 },
    },
    waterPump: {
        name: "Water Pump",
        description: "Pumps water from the ground.",
        category: "machines",
        craftable: true,
        cost: { electronicCircuit: 2, ironGear: 1, pipe: 1 },
        image: "waterPump",
        production: {
            water: {
                produce: {
                    water: 40,
                },
                time: 100,
            }
        }
    },
    boiler: {
        name: "Boiler",
        description: "Turns Water to Steam, burns Coal.",
        category: "machines",
        craftable: true,
        cost: { pipe: 4, stoneFurnace: 1 },
        image: "boiler",
        production: {
            steam: {
                consume: {
                    water: 2,
                    coal: 0.125,
                },
                produce: {
                    steam: 2,
                },
                time: 100,
            }
        }
    },
    steamEngine: {
        name: "Steam Generator",
        description: "Generates Electricity.",
        image: "steamEngine",
        category: "machines",
        craftable: true,
        cost: { ironGear: 8, ironPlate: 10, pipe: 5 },
        production: {
            electricity: {
                consume: {
                    steam: 1,
                },
                produce: {
                    electricity: 100,
                },
                time: 100,
            }
        }
    },
    electricMiner: {
        name: "Electric Mining Drill",
        description: "Automatic resource extractor.",
        image: "electricMiner",
        category: "machines",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 10, },
        //consume: { electricity: 90 },
    },
    oilPump: {
        name: "Oil Pump",
        description: "Pumps oil from the ground.",
        image: "oilPump",
        category: "machines",
        craftable: true,
        cost: { electronicCircuit: 5, ironGear: 10, pipe: 10, },
        //consume: { electricity: 90 },
    },
};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}