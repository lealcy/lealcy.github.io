
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

    // Clear prodPerTick && ConsPerTick indicatiors
    resources.forEach((resource) => {
        resource.prodPerTick = 0;
        resource.consPerTick = 0;
    });

    workers.forEach((worker, workerName) => {
        worker.produce.forEach((rate, resourceName) => {
            if (worker.quantity && workerConsume(worker)) {
                let production = rate * worker.quantity;
                resources.get(resourceName).quantity += production;
                resources.get(resourceName).prodPerTick += production;
            }
        });
    });
}

function workerConsume(worker) {
    let produce = true;
    worker.consume.forEach((quantity, resourceName) => {
        if (resources.get(resourceName).quantity < quantity * worker.quantity) {
            produce = false;
        }
    });
    if (produce) {
        worker.consume.forEach((quantity, resourceName) => {
            resources.get(resourceName).quantity -= quantity * worker.quantity;
            resources.get(resourceName).consPerTick += quantity * worker.quantity;
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


start();
