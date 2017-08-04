const woodEl = document.querySelector("#wood");
const lumberjackEl = document.querySelector("#lumberjack");

let resources = {
    wood: 0,
    lumberjack: 0,
};

let costs = {
    wood: 0,
    lumberjack: { wood: 100 },
};

let updateCount = {
    lumberjack: 60
}

let produce = {
    lumberjack: { wood: 1 }
}

let frameCount = 0;

function update() {
    window.requestAnimationFrame(update);
    frameCount++;
    for (let res in updateCount) {
        if (frameCount % updateCount[res] === 0) {
            for (let prod in produce[res]) {
                resources[prod] += produce[res][prod] * resources[res];
            }
        }
    }


    woodEl.innerHTML = resources.wood;
    lumberjackEl.innerHTML = resources.lumberjack

}

update();

function incLumberjack() {
    let insufficientResources = false;
    for (let res in costs.lumberjack) {
        if (resources[res] < costs.lumberjack[res]) {
            insufficientResources = true;
        }
    }
    if (!insufficientResources) {
        for (let res in costs.lumberjack) {
            resources[res] -= costs.lumberjack[res];
        }
        resources.lumberjack++;
    }
}