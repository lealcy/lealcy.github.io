let workers = new Map;
let resources = new Map;
let workersTable = document.getElementById("workers");
let resourcesTable = document.getElementById("resources");

resources.set("gold", {
    name: "Gold",
    quantity: 0,
    value: 1
});

resources.set("food", {
    name: "Food",
    quantity: 1,
    value: 6
});

resources.set("seed", {
    name: "Seed",
    quantity: 0,
    value: 4
});

resources.set("pelt", {
    name: "Pelt",
    quantity: 0,
    value: 30
});

resources.set("wood", {
    name: "Wood",
    quantity: 0,
    value: 15
});

resources.set("tool", {
    name: "Tool",
    quantity: 0,
    value: 120
});

resources.set("metal", {
    name: "Metal",
    quantity: 0,
    value: 25
});

workers.set("gatherer", {
    name: "Gatherer",
    quantity: 1,
    cost: new Map([["food", 90]]),
    consume: new Map([["food", 1]]),
    produce: new Map([["food", 3]])
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
    consume: new Map([["food", 10]]),
    produce: new Map([["wood", 1]])
});

workers.set("carpenter", {
    name: "Carpenter",
    quantity: 0,
    cost: new Map([["food", 6000]]),
    consume: new Map([["food", 6], ["wood", 3]]),
    produce: new Map([["tool", 1]])
});

workers.set("botanist", {
    name: "Botanist",
    quantity: 0,
    cost: new Map([["food", 500]]),
    consume: new Map([["food", 3]]),
    produce: new Map([["seed", 1]])
});

workers.set("farmer", {
    name: "Farmer",
    quantity: 0,
    cost: new Map([["food", 10000]]),
    consume: new Map([["food", 5], ["seed", 12], ["tool", 3]]),
    produce: new Map([["food", 60]])
});

workers.set("miner", {
    name: "Miner",
    quantity: 0,
    cost: new Map([["food", 7000]]),
    consume: new Map([["food", 12], ["wood", 3], ["tool", 1]]),
    produce: new Map([["metal", 1]])
});

workers.set("tool_blacksmith", {
    name: "Tool Blacksmith",
    quantity: 0,
    cost: new Map([["food", 12000]]),
    consume: new Map([["food", 6], ["wood", 3], ["metal", 1]]),
    produce: new Map([["tool", 5]])
});

workers.set("food_seller", {
    name: "Food Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["wood", 600]]),
    consume: new Map([["food", 4]]),
    produce: new Map([["gold", resources.get("food").value]])
});

workers.set("tool_seller", {
    name: "Tool Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["wood", 600]]),
    consume: new Map([["tool", 1], ["food", 3]]),
    produce: new Map([["gold", resources.get("tool").value]])
});

workers.set("wood_seller", {
    name: "Wood Seller",
    quantity: 0,
    cost: new Map([["food", 5000], ["wood", 600]]),
    consume: new Map([["wood", 1], ["food", 3]]),
    produce: new Map([["gold", resources.get("wood").value]])
});

function tick() {
    setTimeout(tick, 1000);
    updateResources();
    updateScreen();
}

function updateResources() {
    workers.forEach((worker, workerName) => {
        worker.produce.forEach((rate, resourceName) => {
            if (worker.quantity && workerConsume(workerName)) {
                resources.get(resourceName).quantity += rate * worker.quantity;
            }
        });
    });
}

function workerConsume(workerName) {
    let consume = workers.get(workerName).consume;
    let produce = true;
    consume.forEach((quantity, resourceName) => {
        if (resources.get(resourceName).quantity < quantity) {
            produce = false;
        }
    });
    if (produce) {
        consume.forEach((quantity, resourceName) => {
            resources.get(resourceName).quantity -= quantity;
        });
    }
    return produce;
}

function canHire(workerName) {
    let cost = workers.get(workerName).cost;
    let canHire = true;
    cost.forEach((quantity, resourceName) => {
        if (resources.get(resourceName).quantity < quantity) {
            canHire = false;
        }
    });
    return canHire;
}

function hire(workerName) {
    let cost = workers.get(workerName).cost;
    if (canHire(workerName)) {
        cost.forEach((quantity, resourceName) => {
            resources.get(resourceName).quantity -= quantity;
        });
        workers.get(workerName).quantity++;
    }
}

function dismiss(workerName) {
    if (workers.get(workerName).quantity > 0) {
        workers.get(workerName).quantity--;
    }
    // Always must have at least one gatherer.
    if (workers.get("gatherer").quantity < 1) {
        workers.get("gatherer").quantity = 1;
    }
}

function updateScreen() {
    workersTable.innerHTML = "";
    workers.forEach((worker, workerName) => {
        if (worker.quantity || canHire(workerName)) {
            workersTable.innerHTML += `
                <tr>
                    <th>${worker.name}</th>
                    <td>${worker.quantity}</td>
                    <td>${printWorkerCost(workerName)}</td>
                    <td>${printWorkerConsume(workerName)}</td>
                    <td>${printWorkerProduce(workerName)}</td>
                    <td>
                        <input type="button" value="Hire" onclick="hire('${workerName}')"></input>
                        <input type="button" value="Dismiss" onclick="dismiss('${workerName}')"></input>
                    </td>
                </tr>
            `;
        }
    });
    resourcesTable.innerHTML = "";
    resources.forEach(resource => {
        if (resource.quantity) {
            resourcesTable.innerHTML += `
                <tr>
                    <th>${resource.name}</th>
                    <td>${Math.floor(resource.quantity)}</td>
                    <td>${resource.value}</td>
                </tr>`;
        }
    });
}

function printWorkerCost(workerName) {
    let cost = workers.get(workerName).cost;
    let str = "";
    cost.forEach((quantity, resourceName) => {
        str += `${resources.get(resourceName).name}: ${quantity}<br>`; 
    });
    return str;
}

function printWorkerConsume(workerName) {
    let consume = workers.get(workerName).consume;
    let str = "";
    consume.forEach((quantity, resourceName) => {
        str += `${resources.get(resourceName).name}: ${quantity}<br>`; 
    });
    return str;
}

function printWorkerProduce(workerName) {
    let produce = workers.get(workerName).produce;
    let str = "";
    produce.forEach((quantity, resourceName) => {
        str += `${resources.get(resourceName).name}: ${quantity}<br>`; 
    });
    return str;
}


tick();
