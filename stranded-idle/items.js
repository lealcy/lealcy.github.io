import Item from "./Item.js";

const itemData = {
    // Resources
    coal: {
        name: "Coal",
        image: "coal",
        craftable: true,
        productionTime: { /*burnerMiningDrill: 3571.4, eletricMiningDrill: 1904.7*/ },
        products: { coal: 1 },
    },
    stone: {
        name: "Stone",
        image: "stone",
        craftable: true,
        /*    producedBy: { burnerMiningDrill: 2721, eletricMiningDrill: 1538.4 },*/
        products: { stone: 1 },
    },
    iron: {
        name: "Iron Ore",
        craftable: true,
        products: { iron: 1 },
        image: "iron",
    },
    copper: {
        name: "Copper Ore",
        craftable: true,
        products: { copper: 1 },
        image: "copper",
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

    /*
       steelPlate: {
           name: "Steel Plate",
       },
       ironGear: {
           name: "Iron Gear",
           craftable: true,
           cost: { ironPlate: 2 }
       },
       copperCable: {
           name: "Copper Cable",
           craftable: true,
           cost: { copperPlate: 1 },
       },
       eletronicCircuit: {
           name: "Eletronic Circuit",
           craftable: true,
           cost: { copperCable: 3, ironPlate: 1 },
       },*/
    stoneFurnace: {
        name: "Stone Furnace",
        craftable: true,
        cost: { stone: 5 },
        image: "stoneFurnace",
        consume: { coal: 0.08035 },
        productionFactor: 7,
        products: { stoneFurnace: 1 },
    },
    /*   burnerMiningDrill: {
           name: "Burner Mining Drill",
           craftable: true,
           cost: { ironGear: 3, ironPlate: 3, stoneFurnace: 1 },
           image: "burnerMiningDrill",
           category: "miner",
       },
       assembler1: {
           name: "Assembler 1",
           craftable: true,
           cost: { eletronicCircuit: 3, ironGear: 5, ironPlate: 9 },
           image: "assembler1",
           category: "assembler",
       },
   
       // Machines
   
       // Stone Furnaces
       stoneFurnaceStoneBrick: {
           name: "Stone Furnace (Stone Brick)",
           craftable: true,
           cost: { stoneFurnace: 1 },
           produceTime: 3500,
           consume: { stone: 2, coal: 0.07875 },
           produce: { stoneBrick: 1 },
           image: "stoneFurnace",
       },
       stoneFurnaceIronPlate: {
           name: "Stone Furnace (Iron Plate)",
           craftable: true,
           cost: { stoneFurnace: 1 },
           produceTime: 3500,
           consume: { iron: 1, coal: 0.07875 },
           produce: { ironPlate: 1 },
           image: "stoneFurnace",
       },
       stoneFurnaceCopperPlate: {
           name: "Stone Furnace (Copper Plate)",
           craftable: true,
           cost: { stoneFurnace: 1 },
           produceTime: 3500,
           consume: { copper: 1, coal: 0.07875 },
           produce: { copperPlate: 1 },
           image: "stoneFurnace",
       },
       stoneFurnaceSteelPlate: {
           name: "Stone Furnace (Steel Plate)",
           craftable: true,
           cost: { stoneFurnace: 1 },
           produceTime: 17500,
           consume: { ironPlate: 5, coal: 0.39375 },
           produce: { steelPlate: 1 },
           image: "stoneFurnace",
       },
   
       // Burners
       burnerMiningDrillCoal: {
           name: "Burner Mining Drill (Coal)",
           craftable: true,
           cost: { burnerMiningDrill: 1 },
           produceTime: 1960,
           consume: {},
           produce: { coal: 6 },
           image: "burnerMiningDrill",
       },
       burnerMiningDrillStone: {
           name: "Burner Mining Drill (Stone)",
           craftable: true,
           cost: { burnerMiningDrill: 1 },
           produceTime: 2572.5,
           consume: { coal: 1 },
           produce: { stone: 7 },
           image: "burnerMiningDrill",
       },
       burnerMiningDrillIron: {
           name: "Burner Mining Drill (Iron Ore)",
           craftable: true,
           cost: { burnerMiningDrill: 1 },
           produceTime: 1960,
           consume: { coal: 1 },
           produce: { iron: 7 },
           image: "burnerMiningDrill",
       },
       burnerMiningDrillCopper: {
           name: "Burner Mining Drill (Copper Ore)",
           craftable: true,
           cost: { burnerMiningDrill: 1 },
           produceTime: 1960,
           consume: { coal: 1 },
           produce: { copper: 7 },
           image: "burnerMiningDrill",
       },
   
   
       // Assemblers 1
       assembler1StoneFurnace: {
           name: "Assembler 1 (Stone Furnace)",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { stone: 5 },
           produce: { stoneFurnace: 1 },
           image: "assembler1",
       },
       assembler1Assembler1: {
           name: "Assembler 1 (Assembler 1)",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { eletronicCircuit: 3, ironGear: 5, ironPlate: 9 },
           produce: { assembler1: 1 },
           image: "assembler1",
       },
       assembler1StoneFurnaceStoneBrick: {
           name: "Assembler 1 (Stone Furnace (Stone Brick))",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { stoneFurnace: 1 },
           produce: { stoneFurnaceStoneBrick: 1 },
           image: "assembler1",
       },
       assembler1StoneFurnaceIronPlate: {
           name: "Assembler 1 (Stone Furnace (Iron Plate))",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { stoneFurnace: 1 },
           produce: { stoneFurnaceIronPlate: 1 },
           image: "assembler1",
       },
       assembler1StoneFurnaceCopperPlate: {
           name: "Assembler 1 (Stone Furnace (Copper Plate))",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { stoneFurnace: 1 },
           produce: { stoneFurnaceCopperPlate: 1 },
           image: "assembler1",
       },
       assembler1StoneFurnaceSteelPlate: {
           name: "Assembler 1 (Stone Furnace (Steel Plate))",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { stoneFurnace: 1 },
           produce: { stoneFurnaceSteelPlate: 1 },
           image: "assembler1",
       },
       assembler1IronGear: {
           name: "Assembler 1 (Iron Gear)",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { ironPlate: 2 },
           produce: { ironGear: 1 },
           image: "assembler1",
       },
       assembler1CopperCable: {
           name: "Assembler 1 (Copper Cable)",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { copperPlate: 1 },
           produce: { copperCable: 2 },
           image: "assembler1",
       },
       assembler1EletronicCircuit: {
           name: "Assembler 1 (Eletronic Circuit)",
           craftable: true,
           cost: { assembler1: 1 },
           produceTime: 500,
           consume: { copperCable: 3, ironPlate: 1 },
           produce: { eletronicCircuit: 1 },
           image: "assembler1",
       },*/
};

export const items = new Map;

for (const item in itemData) {
    items.set(item, new Item(item, itemData[item]));
}