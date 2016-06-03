"use strict";

let canvas = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let imageSrcs = [ 
    ["terrain", "images/terrain.png"],
    ["solarpanel", "images/solarpanel2.png"],
    ["solarpanelbig", "images/solarpanelb.png"],
    ["info", "images/info.png"],
    ["remove", "images/remove.png"],
    ["rubble", "images/rubble.png"]
];
let images = {};
let selectedTool = "info";
let mouseX = 0;
let mouseY = 0;
let terrainX = 0;
let terrainY = 0;
let terrainWidth = canvas.width - 130;
let terrainHeight = canvas.height;
let toolbarX = terrainWidth;
let toolbarY = 0;
let toolbarWidth = canvas.width - terrainWidth;
let toolbarHeight = canvas.height;
let structureWidth = 64;
let structureHeight = 64;
let dnAlpha = 0.0;
let dnMinAlpha = 0.0;
let dnMaxAlpha = 0.7;
let dnTick = 0;
let dnIndex = 0;
let dnMaxIndex = 3;
let showHighlight = true;
let structures = {
    solarpanel: {
        id: "solarpanel",
        name: "Solar Panel (small)",
        image: "solarpanel"
    },
    solarpanelbig: {
        id: "solarpanelbig",
        name: "Solar Panel (big)",
        image: "solarpanelbig"
    },
    rubble: {
        id: "rubble",
        name: "Rubble",
        image: "rubble"
    }
};
let tools = {
    info: {
        id: "info",
        name: "Information",
        image: "info"
    },
    remove: {
        id: "remove",
        name: "Remove",
        image: "remove"
    },
    solarpanel: {
        id: "solarpanel",
        name: structures.solarpanel.name,
        image: structures.solarpanel.image
    },
    solarpanelbig: {
        id: "solarpanelbig",
        name: structures.solarpanelbig.name,
        image: structures.solarpanelbig.image
    }
};
let dnCycle = [
    { ticks: 3600, minAlpha: dnMinAlpha, maxAlpha: dnMinAlpha }, // Day
    { ticks: 600, minAlpha: dnMinAlpha, maxAlpha: dnMaxAlpha }, // Sundown
    { ticks: 2400, minAlpha: dnMaxAlpha, maxAlpha: dnMaxAlpha }, // Night
    { ticks: 600, minAlpha: dnMaxAlpha, maxAlpha: dnMinAlpha } // Sunrise
];

// Game State
let gs = {
    placedStructures: []
};

function start() {
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = mouseMove;
    placeStructure("solarpanel", 150, 150);
    placeStructure("solarpanelbig", 250, 250);
    loadImages();
}

function refresh() {
    window.requestAnimationFrame(refresh);
    drawTerrain();
    drawPlacementHighlights();
    drawStructures();
    drawMouseTool();
    drawDayNightCycle();
    drawToolbar();
}

function drawTerrain() {
    ctx.drawImage(images.terrain, terrainX, terrainY);
}

function drawPlacementHighlights() {
    if (showHighlight && isInside(mouseX, mouseY, terrainX, terrainY, 
        terrainWidth, terrainHeight) && 
        structures.hasOwnProperty(selectedTool)) {
        for (let ps of gs.placedStructures) {
            if (ps.structure !== structures.rubble && 
                overlapStructure(mouseX, mouseY, ps.x, ps.y, structureWidth, 
                structureHeight)) {
                ctx.fillStyle = "rgba(200, 0, 0, 0.3)";
                ctx.fillRect(ps.x, ps.y, structureWidth, structureHeight);
            }
        }
    }
}

function drawStructures() {
    gs.placedStructures.forEach((ps) => {
        ctx.drawImage(images[ps.structure.image], ps.x, ps.y);
    });
}

function drawMouseTool() {
    if (isInside(mouseX, mouseY, terrainX, terrainY, terrainWidth, 
        terrainHeight)) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(images[tools[selectedTool].image], mouseX, mouseY);
        ctx.restore();
    }
}

function drawDayNightCycle() {
    let cycle = dnCycle[dnIndex];
    if (cycle.minAlpha === cycle.maxAlpha) {
        dnAlpha = cycle.minAlpha;
    } else if (cycle.minAlpha < cycle.maxAlpha) {
        dnAlpha = (((cycle.maxAlpha - cycle.minAlpha) / cycle.ticks) * dnTick) + 
            cycle.minAlpha;
    } else {
        dnAlpha = (((cycle.minAlpha - cycle.maxAlpha) / cycle.ticks) * 
            (cycle.ticks - dnTick)) + cycle.maxAlpha;
    } 
    dnTick++;
    if (dnTick > cycle.ticks) {
        dnTick = 0;
        dnIndex++;
        if (dnIndex > dnMaxIndex) {
            dnIndex = 0;
        }
    }    
    ctx.fillStyle = `rgba(0, 0, 22, ${dnAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawToolbar() {
    ctx.fillStyle = "rgba(200, 150, 100, 0.7)";
    ctx.fillRect(toolbarX, toolbarY, toolbarWidth, toolbarHeight);
    let col = 0;
    let row = 0;
    for (let t in tools) {
        t = tools[t];
        t.x = toolbarX + col;
        t.y = toolbarY + row;
        ctx.drawImage(images[t.image], t.x, t.y);
        if (selectedTool === t.id) {
            ctx.strokeStyle = "rgba(250, 250, 80, 1.0)";
            ctx.strokeRect(t.x, t.y, structureWidth, structureHeight);
        }
        if (col === structureWidth) {
            col = 0;
            row += structureHeight;
        } else {
            col = structureWidth;
        }
    }
}

function placeStructure(sid, x, y) {
    console.log(x, y, "Placing Structure", structures[sid].name);
    gs.placedStructures.push({structure: structures[sid], x, y});
}

function removeStructure(placedStructure) {
    placedStructure.structure = structures.rubble;
}

function clearRubble(x, y) {
    let nps = [];
    gs.placedStructures.forEach((ps) => {
        if (ps.structure === structures.rubble && 
            overlapStructure(x, y, ps.x, ps.y)) {
            return;
        }
        nps.push(ps);
    });
    gs.placedStructures = nps;
}

function mouseUp(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    
    // Placing structures on the terrain
    if (structures.hasOwnProperty(selectedTool) && isPlacementValid(x, y)) {
        placeStructure(selectedTool, x, y);
        clearRubble(x, y);
        showHighlight = false;
        setTimeout(() => showHighlight = true, 300);
        return;
    }
    if (isInside(x, y, terrainX, terrainY, terrainWidth, terrainHeight)) {
        for (let ps of gs.placedStructures) {
            if (isInside(x, y, ps.x, ps.y, structureWidth, structureHeight)) {
                // Clicking on a placed structure
                console.log(x, y, "PlacedStructure", ps.structure.name);
                if (selectedTool === "remove") {
                    removeStructure(ps);
                }
                return;
            }
        }
        // Clicking on the terrain
        console.log(x, y, "Terrain");
        return;
    }
    for (let t in tools) {
        t = tools[t];
        if (isInside(x, y, t.x, t.y, structureWidth, structureHeight)) {
            selectedTool = t.id;
            console.log(x, y, "Tool", t.name);
            return;
        }
    }
}

function mouseMove(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

function isInside(x, y, tx, ty, twidth, theight) {
    return x >= tx && y >= ty && x < twidth + tx && y < theight + ty;
}

function overlapStructure(x, y, sx, sy) {
    return isInside(x, y, sx, sy, structureWidth, structureHeight) ||
        isInside(x + 64, y, sx, sy, structureWidth, structureHeight) ||
        isInside(x, y + 64, sx, sy, structureWidth, structureHeight) ||
        isInside(x + 64, y + 64, sx, sy, structureWidth, structureHeight);
}

function isPlacementValid(x, y) {
    if (!isInside(x, y, 0, 0, terrainWidth, terrainHeight) ||
        !isInside(x + 64, y, 0, 0, terrainWidth, terrainHeight) ||
        !isInside(x, y + 64, 0, 0, terrainWidth, terrainHeight) ||
        !isInside(x + 64, y + 64, 0, 0, terrainWidth, terrainHeight)) {
        console.log(x, y, "Outside Terrain");
        return false;
    }
    for (let ps of gs.placedStructures) {
        if (ps.structure !== structures.rubble && overlapStructure(x, y, ps.x, ps.y)) {
            console.log(x, y, "Overlapping", ps.structure.name);
            return false;
        }
    }
    return true;
}

function loadImages() {
    let loadedImages = 0;
    imageSrcs.forEach((src) => {
        let image = new Image();
        image.onload = () => {
            loadedImages++;
            if (loadedImages == imageSrcs.length) {
                console.log("All images loaded.");
                refresh();
            }
        };
        image.src = src[1];
        images[src[0]] = image;
    });
}

start();