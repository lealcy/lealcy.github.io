
let workersTable = document.getElementById("workers");
let resourcesTable = document.getElementById("resources");


function buildScreen() {
    workersTable.innerHTML = "";
    workers.forEach((worker, workerName) => {
        workersTable.innerHTML += `
            <tr id="${workerName}" style="display: none">
                <th>${worker.name}</th>
                <td id="${workerName}_quantity">${worker.quantity}</td>
                <td>${printWorkerCost(workerName)}</td>
                <td>${printWorkerConsume(workerName)}</td>
                <td>${printWorkerProduce(workerName)}</td>
                <td>
                    <input type="button" value="Hire" onclick="hire('${workerName}')"></input>
                    <input type="button" value="Dismiss" onclick="dismiss('${workerName}')"></input>
                </td>
            </tr>
        `;
    });
    resourcesTable.innerHTML = "";
    resources.forEach((resource, resourceName) => {
        resourcesTable.innerHTML += `
            <tr id="${resourceName}" style="display: none">
                <th>${resource.name}</th>
                <td id="${resourceName}_quantity">${Math.floor(resource.quantity)}</td>
                <td id="${resourceName}_prodPerTick">${resource.prodPerTick}</td>
                <td id="${resourceName}_consPerTick">${resource.consPerTick}</td>
                <td id="${resourceName}_surplus">0</td>
                <td>${resource.value}</td>
            </tr>`;
    });
}

function updateScreen() {
    workers.forEach((worker, workerName) => {
        document.getElementById(`${workerName}_quantity`).innerHTML = worker.quantity;
        if (worker.quantity || canHire(workerName)) {
            document.getElementById(workerName).style.display = "table-row";
        }
    });
    resources.forEach((resource, resourceName) => {
        document.getElementById(`${resourceName}_quantity`).innerHTML = resource.quantity;
        document.getElementById(`${resourceName}_prodPerTick`).innerHTML = resource.prodPerTick;
        document.getElementById(`${resourceName}_consPerTick`).innerHTML = resource.consPerTick;
        document.getElementById(`${resourceName}_surplus`).innerHTML = resource.prodPerTick - resource.consPerTick;
        if (resource.quantity) {
            document.getElementById(resourceName).style.display = "table-row";
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