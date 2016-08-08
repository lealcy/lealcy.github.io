let workers = new Map;

workers.set("gatherer", {
    name: "Gatherer",
    quantity: 1,
    cost: new Map([["food", 90]]),
    consume: new Map,
    produce: new Map([["food", 2]])
});

workers.set("forager", {
    name: "Forager",
    quantity: 0,
    cost: new Map([["food", 110]]),
    consume: new Map([["food", 1]]),
    produce: new Map([["firewood", 1]])
});

workers.set("tinker", {
    name: "Tinker",
    quantity: 0,
    cost: new Map([["food", 140]]),
    consume: new Map([["food", 2], ["firewood", 5]]),
    produce: new Map([["tool", 1]])
});

workers.set("hunter", {
    name: "Hunter",
    quantity: 0,
    cost: new Map([["food", 300]]),
    consume: new Map([["food", 3], ["tool", 1]]),
    produce: new Map([["food", 10], ["pelt", 2]])
});

workers.set("lumberjack", {
    name: "Lumberjack",
    quantity: 0,
    cost: new Map([["food", 2000]]),
    consume: new Map([["food", 10], ["tool", 5]]),
    produce: new Map([["log", 1]])
});

workers.set("woodcutter", {
    name: "Woodcutter",
    quantity: 0,
    cost: new Map([["food", 3000]]),
    consume: new Map([["food", 5], ["log", 1], ["tool", 4]]),
    produce: new Map([["wood", 4], ["firewood", 3]])
});

workers.set("carpenter", {
    name: "Carpenter",
    quantity: 0,
    cost: new Map([["food", 6000]]),
    consume: new Map([["food", 6], ["wood", 1], ["tool", 3]]),
    produce: new Map([["plank", 2]])
});

workers.set("botanist", {
    name: "Botanist",
    quantity: 0,
    cost: new Map([["food", 500]]),
    consume: new Map([["food", 3], ["tool", 2]]),
    produce: new Map([["seed", 1]])
});

workers.set("farmer", {
    name: "Farmer",
    quantity: 0,
    cost: new Map([["food", 10000]]),
    consume: new Map([["food", 5], ["seed", 12], ["tool", 10]]),
    produce: new Map([["food", 60]])
});

workers.set("iron_miner", {
    name: "Iron Miner",
    quantity: 0,
    cost: new Map([["food", 7000]]),
    consume: new Map([["food", 12], ["plank", 3], ["tool", 15]]),
    produce: new Map([["iron_ore", 1]])
});

workers.set("smelter", {
    name: "Smelter",
    quantity: 0,
    cost: new Map([["food", 8500]]),
    consume: new Map([["food", 7], ["firewood", 3], ["iron_ore", 5], ["tool", 3]]),
    produce: new Map([["iron_bar", 1]])
});

workers.set("tool_blacksmith", {
    name: "Tool Blacksmith",
    quantity: 0,
    cost: new Map([["food", 12000]]),
    consume: new Map([["food", 6], ["plank", 1], ["iron_bar", 1], ["firewood", 1]]),
    produce: new Map([["tool", 10]])
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
