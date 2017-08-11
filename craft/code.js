const resEl = document.querySelector("#resources");

let produceInterval = 60;
let frameCount = 0;

function update() {
    window.requestAnimationFrame(update);
    frameCount++;
    for (let res in resources) {
        if (frameCount % produceInterval === 0 && produce[res]) {
            for (let prod in produce[res]) {
                resources[prod] += produce[res][prod] * resources[res];
            }
        }
        document.getElementById(res).innerText = formatNumber(resources[res], 1);
    }
}

function clickAction(res) {
    if (costs[res] === 0) {
        resources[res]++;
        return;
    }
    let insufficientResources = false;
    for (let src in costs[res]) {
        if (resources[src] < costs[res][src]) {
            insufficientResources = true;
        }
    }
    if (!insufficientResources) {
        for (let src in costs[res]) {
            resources[src] -= costs[res][src];
        }
        resources[res]++;
    }
}

function capitalize(text) {
    let result = text[0].toUpperCase();
    let rest = text.slice(1);
    for (let letter of rest) {
        result += letter === letter.toUpperCase() ? ' ' + letter : letter;
    }
    return result;
}

function formatNumber(num, digits) {
    let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let decimal;
    for (let i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);
        if (num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }
    return num;
}


function start() {
    for (let res in resources) {
        let button = `<button id="${res}Button" onclick="clickAction('${res}')"`;
        if (costs[res]) {
            button += ` title="Requires:\n`;
            for (let cost in costs[res]) {
                button += `${capitalize(cost)}: ${costs[res][cost]}\n`;
            }
            button += `"`;
        }
        button += `>
            <img src="${res}.gif" width="64" height="64">
            <div>
                ${capitalize(res)}: <span id="${res}">0</span>
            </div>
        </button>`;
        resEl.innerHTML += button;
    }
    window.requestAnimationFrame(update);
}


let resources = {
    wood: 0,
    stone: 0,
    lumberjack: 0,
    stoneCutter: 0,
    lumbermill: 0,
    woodWorker: 0,
    quarry: 0,
};

let costs = {
    lumberjack: {
        wood: 100,
    },
    stoneCutter: {
        stone: 100,
    },
    lumbermill: {
        wood: 10000,
        stone: 1000,
        lumberjack: 100,
    },
    woodWorker: {
        wood: 1000000,
        lumberjack: 10000,
        lumbermill: 100,
    },
    quarry: {
        wood: 10000,
        stoneCutter: 100,
        lumbermill: 10,
        woodWorker: 1,
    }
};

let produce = {
    lumberjack: {
        wood: 1,
    },
    stoneCutter: {
        stone: 1,
    },
    lumbermill: {
        lumberjack: 1,
    },
    woodWorker: {
        lumbermill: 1,
    },
    quarry: {
        stoneCutter: 1,
    }
}

start();