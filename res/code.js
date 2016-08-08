
function start() {
    buildScreen();
    window.requestAnimationFrame(tick);
}

function tick() {
    window.requestAnimationFrame(tick);
    updateResources();
    updateScreen();
}

function updateResources() {
    console.log("update resource");
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
    console.log("hire");
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


start();
