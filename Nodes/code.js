"use strict";

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let nodes = [];
let selectedNode = null;
let frameCount = 0;
let drawSelected = false;

const NODE_RADIUS = 25;
const TAU = 2 * Math.PI;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.nodes = [];
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, NODE_RADIUS, 0, TAU, false);
        if (this === selectedNode && drawSelected) {
            ctx.lineWidth = 2;
        }
        ctx.stroke();
        ctx.restore();
        for (let node of this.nodes) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
        }
    }

}

// Calculate the distance between two points in a plane.
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

function doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    let s1x = x2 - x1;
    let s1y = y2 - y1;
    let s2x = x4 - x3;
    let s2y = y4 - y3;
    let s = (-s1y * (x1 - x3) + s1x * (y1 - y3)) / (-s2x * s1y + s1x * s2y);
    let t = (s2x * (y1 - y3) - s2y * (x1 - x3)) / (-s2x * s1y + s1x * s2y);

    return s > 0 && s < 1 && t > 0 && t < 1;
}

function doCirclesInterSect(x1, y1, r1, x2, y2, r2) {
    return dist(x1, y1, x2, y2) < r1 + r2;
}

canvas.addEventListener("mousemove", e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}, false);

canvas.addEventListener("mouseup", e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    let insideNode = false;
    for (let node of nodes) {
        if (dist(mouseX, mouseY, node.x, node.y) < NODE_RADIUS) {
            insideNode = true;
            if (selectedNode) {
                if (!node.nodes.includes(selectedNode) && !selectedNode.nodes.includes(node)) {
                    let intersect = false;
                    for (let node2 of nodes) {
                        for (let subnode of node2.nodes) {
                            if (intersect = doLinesIntersect(node2.x, node2.y, subnode.x, subnode.y, node.x, node.y, selectedNode.x, selectedNode.y)) {
                                break;
                            }
                        }
                        if (intersect) {
                            break;
                        }
                    }
                    if (!intersect) {
                        node.nodes.push(selectedNode);
                    }
                }
                selectedNode = node;
            }
            break;
        }
    }
    if (!insideNode) {
        let intersect = false;
        for (let node of nodes) {
            if (intersect = doCirclesInterSect(mouseX, mouseY, NODE_RADIUS, node.x, node.y, NODE_RADIUS)) {
                break;
            }
        }
        if (!intersect) {
            selectedNode = new Node(mouseX, mouseY);
            nodes.push(selectedNode);
        }
    }
}, false);

function tick() {
    window.requestAnimationFrame(tick);
    frameCount++;
    if (frameCount % 30 === 0) {
        drawSelected = !drawSelected;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let node of nodes) {
        node.draw();
    }
    if (selectedNode) {
        ctx.beginPath();
        let intersect = false;
        for (let node of nodes) {
            if (intersect = doCirclesInterSect(mouseX, mouseY, NODE_RADIUS, node.x, node.y, NODE_RADIUS)) {
                break;
            }
        }
        if (intersect) {
            ctx.moveTo(selectedNode.x, selectedNode.y);
            ctx.lineTo(mouseX, mouseY);
        } else {
            ctx.arc(mouseX, mouseY, NODE_RADIUS, 0, TAU, false);
        }
        ctx.stroke();
    }
}

tick();