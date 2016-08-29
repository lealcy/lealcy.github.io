let workers = new Map;

workers.set("gatherer", {
    name: "Gatherer",
    quantity: 1,
    cost: new Map([["food", 1]]),
    consume: new Map,
    produce: new Map([["food", 1]])
});

workers.set("forager", {
    name: "Forager",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1]]),
    produce: new Map([["firewood", 1]])
});

workers.set("tinker", {
    name: "Tinker",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["firewood", 1]]),
    produce: new Map([["tool", 1]])
});

workers.set("hunter", {
    name: "Hunter",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["tool", 1]]),
    produce: new Map([["food", 1], ["pelt", 1]])
});

workers.set("lumberjack", {
    name: "Lumberjack",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["tool", 1]]),
    produce: new Map([["log", 1]])
});

workers.set("woodcutter", {
    name: "Woodcutter",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["log", 1], ["tool", 1]]),
    produce: new Map([["wood", 1], ["firewood", 1]])
});

workers.set("carpenter", {
    name: "Carpenter",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["wood", 1], ["tool", 1]]),
    produce: new Map([["plank", 1]])
});

workers.set("botanist", {
    name: "Botanist",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["tool", 1]]),
    produce: new Map([["seed", 1]])
});

workers.set("farmer", {
    name: "Farmer",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["seed", 1], ["tool", 1]]),
    produce: new Map([["food", 1]])
});

workers.set("iron_miner", {
    name: "Iron Miner",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["plank", 1], ["tool", 1]]),
    produce: new Map([["iron_ore", 1]])
});

workers.set("smelter", {
    name: "Smelter",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["firewood", 1], ["iron_ore", 1], ["tool", 1]]),
    produce: new Map([["iron_bar", 1]])
});

workers.set("tool_blacksmith", {
    name: "Tool Blacksmith",
    quantity: 0,
    cost: new Map([["food", 1]]),
    consume: new Map([["food", 1], ["plank", 1], ["iron_bar", 1], ["firewood", 1], ["pelt", 1]]),
    produce: new Map([["tool", 1]])
});

/*workers.set("food_seller", {
    name: "Food Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["plank", 600]]),
    consume: new Map([["food", 4]]),
    produce: new Map([["gold", resources.get("food").value]])
});

workers.set("tool_seller", {
    name: "Tool Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["plank", 600]]),
    consume: new Map([["tool", 1], ["food", 3]]),
    produce: new Map([["gold", resources.get("tool").value]])
});

workers.set("plank_seller", {
    name: "Plank Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["plank", 600]]),
    consume: new Map([["plank", 1], ["food", 3]]),
    produce: new Map([["gold", resources.get("wood").value]])
});*/
