const click = document.querySelector("#click");
const upgradeClick = document.querySelector("#upgradeClick")
const autoClick = document.querySelector("#autoClick");

let clicks = 0;
let clickLevel = 1;
let clickLevelCost = 10;
let autoClickLevel = 0;
let autoClickLevelCost = 100;
let autoClickStarted = false;

function start() {
    click.addEventListener("click", click_click, false);
    upgradeClick.addEventListener("click", upgradeClick_click, false);
    autoClick.addEventListener("click", autoClick_click, false);
}

function update() {
    click.innerHTML = `<strong>Click!</strong><br>Clicks: ${clicks}<br>Clicks per click: ${clickLevel * clickLevel}`;
    upgradeClick.innerHTML = `<strong>Upgrade Click!</strong><br>Level ${clickLevel}<br>Cost: ${clickLevelCost} clicks`;
    autoClick.innerHTML = `<strong>Upgrade Auto Click!</strong>
    <br>Level ${autoClickLevel}
    <br>Cost ${autoClickLevelCost} clicks
    <br>${autoClickLevel === 0 ? 0 : (10000 / autoClickLevel) / 1000} clicks per second.`;
    if (clicks >= clickLevelCost) {
        upgradeClick.style.display = "initial";
    }
    if (clicks >= autoClickLevelCost) {
        autoClick.style.display = "initial";
    }
}

function click_click(e) {
    clicks += clickLevel * clickLevel;
    update();
    console.log(`clicks: ${clicks}, clickLevel: ${clickLevel}, clickLevelCost: ${clickLevelCost}, autoClickLevelCost: ${autoClickLevelCost}`);
}

function upgradeClick_click(e) {
    if (clicks >= clickLevelCost) {
        clicks -= clickLevelCost;
        clickLevel++;
        clickLevelCost += Math.ceil(clickLevelCost * 1.1);
    }
    update();
}

function autoClick_click(e) {
    if (clicks >= autoClickLevelCost) {
        clicks -= autoClickLevelCost;
        autoClickLevel++;
        autoClickLevelCost += Math.ceil(autoClickLevelCost * autoClickLevel);
    }
    if (autoClickStarted !== true && autoClickLevel) {
        autoClickStarted = true;
        performAutoClick();
    }
    update();
}

function performAutoClick() {
    clicks += clickLevel * clickLevel;
    update();
    setTimeout(performAutoClick, 10000 / autoClickLevel);
}

start();