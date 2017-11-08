import Item from "./Item.js";

const itemData = {
    // Resources
    coal: {
        name: "Coal",
        description: "Power machines and produce power.",
        image: "coal",
        craftable: true,
        visisble: true,
        category: "resources",
    },
    stone: {
        name: "Stone",
        description: "Craft furnaces and bricks.",
        image: "stone",
        craftable: true,
        visisble: true,
        category: "resources",
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        description: "Melt it into plates.",
        image: "iron",
        visisble: true,
        category: "resources",
    },
    copper: {
        name: "Copper Ore",
        description: "Melt it into plates.",
        craftable: true,
        image: "copper",
        visisble: true,
        category: "resources",
    },

    // Electricity
    electricity: {
        name: "Electricity",
        image: "electricity",
        description: "Power machines.",
        category: "electricity",
    },

    // Liquids
    water: {
        name: "Water",
        description: "Is a liquid, fishes pee on it.",
        image: "water",
        category: "fluids"
    },
    petroleum: {
        name: "Petroleum",
        description: "Black gold.",
        image: "petroleum",
        category: "fluids",
    },
    heavyOil: {
        name: "Heavy Oil",
        description: "Usable oil.",
        image: "lightOil",
        category: "fluids",
    },
    lightOil: {
        name: "Light Oil",
        description: "Usable oil.",
        image: "heavyOil",
        category: "fluids",
    },

    // Gases
    steam: {
        name: "Steam",
        description: "If you liked it, then you should have put a Steam Engine on it.",
        image: "steam",
        category: "fluids",
    },
    naturalGas: {
        name: "Natural Gas",
        description: "Pass it.",
        image: "naturalGas",
        category: "fluids",
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
    plastic: {
        name: "Plastic",
        description: "Your flexible friend.",
        image: "plastic",
        category: "intermediateProducts",
    },
    microprocessor: {
        name: "Microprocessor",
        description: "Better automation",
        image: "microprocessor",
        category: "intermediateProducts",
        craftable: true,
        cost: {
            copperCable: 4,
            electronicCircuit: 2,
            plastic: 2,
        }
    },
    processingModule: {
        name: "Processing Module",
        description: "Advanced.",
        image: "processingModule",
        category: "intermediateProducts",
        craftable: true,
        cost: {
            microprocessor: 5,
            electronicCircuit: 5,
        }
    },

    // Machinery
    pipe: {
        name: "Pipe",
        description: "Contain liquids and gases.",
        image: "pipe",
        category: "intermediateProducts",
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
        category: "smelting",
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
        category: "mining",
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
    },
    assembler1: {
        /*
            Electricity: 500w per type of ingredient in cost;
            Time: 325ms per quantity of ingredient in cost;
        */
        name: "Basic Fabricator",
        description: "Produce items that require up to two different ingredients.",
        category: "fabrication",
        craftable: true,
        image: "assembler1",
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9 },
        production: {
            ironGear: {
                consume: {
                    electricity: 500,
                    ironPlate: 2,
                },
                produce: {
                    ironGear: 1
                },
                time: 750,
            },
            copperCable: {
                consume: {
                    electricity: 500,
                    copperPlate: 1,
                },
                produce: {
                    copperCable: 1,
                },
                time: 325,
            },
            electronicCircuit: {
                consume: {
                    electricity: 1000,
                    copperCable: 3,
                    ironPlate: 1,
                },
                produce: {
                    electronicCircuit: 1
                },
                time: 825,
            },
            pipe: {
                consume: {
                    electricity: 500,
                    ironPlate: 1,
                },
                produce: {
                    pipe: 1
                },
                time: 325,
            },
            stoneFurnace: {
                consume: {
                    electricity: 500,
                    stone: 5,
                },
                produce: {
                    stoneFurnace: 1,
                },
                time: 1625,
            },
            boiler: {
                consume: {
                    electricity: 1000,
                    pipe: 4,
                    stoneFurnace: 1,
                },
                produce: {
                    boiler: 1,
                },
                time: 1625,
            },
            processingModule: {
                consume: {
                    electricity: 1000,
                    microprocessor: 5,
                    electronicCircuit: 5,
                },
                produce: {
                    processingModule: 1,
                },
                time: 3250,
            },
            assembler3: {
                consume: {
                    electricity: 1000,
                    assembler2: 2,
                    processingModule: 4,
                },
                produce: {
                    assembler3: 1,
                },
                time: 1950,
            },
        },
    },
    assembler2: {
        /*
            Electricity: 500w per type of ingredient in cost;
            Time: 200ms per quantity of ingredient in cost;
        */
        name: "Extended Fabricator",
        description: "Craft items that use three or four ingredients of distinct types.",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 9, assembler1: 1 },
        image: "assembler2",
        category: "fabrication",
        production: {
            assembler1: {
                consume: {
                    electricity: 1500,
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 9,
                },
                produce: {
                    assembler1: 1,
                },
                time: 3000,
            },
            burnerMiner: {
                consume: {
                    electricity: 1500,
                    ironGear: 3,
                    ironPlate: 3,
                    stoneFurnace: 1,
                },
                produce: {
                    burnerMiner: 1,
                },
                time: 1400,
            },
            assembler2: {
                consume: {
                    electricity: 2000,
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 9,
                    assembler1: 1,
                },
                produce: {
                    assembler2: 1,
                },
                time: 3600,
            },
            waterPump: {
                consume: {
                    electricity: 1500,
                    electronicCircuit: 2,
                    ironGear: 1,
                    pipe: 1,
                },
                produce: {
                    waterPump: 1,
                },
                time: 800,
            },
            steamEngine: {
                consume: {
                    electricity: 1500,
                    ironGear: 8,
                    ironPlate: 10,
                    pipe: 5,
                },
                produce: {
                    steamEngine: 1,
                },
                time: 4600,
            },
            electricMiner: {
                consume: {
                    electricity: 1500,
                    electronicCircuit: 3,
                    ironGear: 5,
                    ironPlate: 10,
                },
                produce: {
                    electricMiner: 1,
                },
                time: 3600,
            },
            oilPump: {
                consume: {
                    electricity: 1500,
                    electronicCircuit: 5,
                    ironGear: 10,
                    pipe: 10,
                },
                produce: {
                    oilPump: 1,
                },
                time: 5000,
            },
            microprocessor: {
                consume: {
                    electricity: 1500,
                    copperCable: 4,
                    electronicCircuit: 2,
                    plastic: 2,
                },
                produce: {
                    microprocessor: 1,
                },
                time: 1600,
            }
        }
    },
    assembler3: {
        /*
            Electricity: 500w per type of ingredient in cost;
            Time: 150ms per quantity of ingredient in cost;
        */
        name: "Advanced Fabricator",
        description: "Produce items with five to six different ingredients.",
        category: "fabrication",
        image: "assembler3",
        craftable: true,
        cost: { assembler2: 2, processingModule: 4 },
        production: {
            refinery: {
                consume: {
                    electricity: 2500,
                    electronicCircuit: 10,
                    ironGear: 10,
                    pipe: 10,
                    steelPlate: 15,
                    stoneBrick: 10,
                },
                produce: {
                    refinery: 1,
                },
                time: 8250,
            }
        }
    },
    waterPump: {
        name: "Water Pump",
        description: "Pumps water from the ground.",
        category: "extraction",
        craftable: true,
        cost: { electronicCircuit: 2, ironGear: 1, pipe: 1 },
        image: "waterPump",
        production: {
            water: {
                produce: {
                    water: 4,
                },
                time: 10,
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
                    water: 1,
                    coal: 0.007,
                },
                produce: {
                    steam: 1,
                },
                time: 50,
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
        category: "mining",
        craftable: true,
        cost: { electronicCircuit: 3, ironGear: 5, ironPlate: 10, },
        production: {
            coal: {
                consume: {
                    electricity: 900,
                },
                produce: {
                    coal: 1,
                },
                time: 1000,
            },
            iron: {
                consume: {
                    electricity: 900,
                },
                produce: {
                    iron: 1,
                },
                time: 1000,
            },
            copper: {
                consume: {
                    electricity: 900,
                },
                produce: {
                    copper: 1,
                },
                time: 1000,
            },
            stone: {
                consume: {
                    electricity: 720,
                },
                produce: {
                    stone: 1,
                },
                time: 800,
            },
        }
    },
    oilPump: {
        name: "Oil Pump",
        description: "Pumps oil from the ground.",
        image: "oilPump",
        category: "extraction",
        craftable: true,
        cost: { electronicCircuit: 5, ironGear: 10, pipe: 10, },
        production: {
            petroleum: {
                consume: {
                    electricity: 45,
                },
                produce: {
                    petroleum: 1,
                },
                time: 50,
            }
        },
    },
    refinery: {
        name: "Refinery",
        description: "Convert petroleum in useful products",
        craftable: true,
        image: "refinery",
        cost: { electronicCircuit: 10, ironGear: 10, pipe: 10, steelPlate: 15, stoneBrick: 10 },
        production: {
            basicProcessing: {
                consume: {
                    petroleum: 10,
                    electricity: 400,
                },
                produce: {
                    heavyOil: 3,
                    lightOil: 3,
                    naturalGas: 4,
                },
                time: 500,
            },
            advancedProcessing: {
                consume: {
                    petroleum: 100,
                    water: 50,
                },
                produce: {
                    heavyOil: 15,
                    lightOil: 65,
                    naturalGas: 80,
                },
                time: 5000,
            },
            coalLiquifaction: {
                consume: {
                    coal: 10,
                    heavyOil: 25,
                    steam: 50,
                },
                produce: {
                    heavyOil: 35,
                    lightOil: 15,
                    naturalGas: 20,
                },
                time: 5000,
            }
        }
    },
    chemicalPlant: {
        name: "chemical Plant",
        description: "Environment friendly.",
        craftable: true,
        image: "chemicalPlant",
        cost: { electronicCircuit: 5, ironGear: 5, pipe: 5, steelPlate: 5 },
        production: {
            plastic: {
                consume: {
                    coal: 1,
                    naturalGas: 20,
                },
                produce: {
                    plastic: 2,
                },
                time: 1000,
            }
        }
    }
};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}