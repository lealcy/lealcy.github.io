"use strict";
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false,
});
context.imageSmoothingEnabled = false;
const SLOT_IMAGE = new Image();
SLOT_IMAGE.src = "slotImage2.png";
const SLOTS_FRAME = new Image();
SLOTS_FRAME.src = "slotsFrame.png";
const SLOT_HEIGHT = 96;
const STAMP_WIDTH = 16;
const STAMP_HEIGHT = 16;
const WIDTH = 8;
const HEIGHT = 8;

let slots;
let scale;

function start() {
    requestAnimationFrame(update);
    canvas.addEventListener("click", e => click(e.offsetX, e.offsetY), false);
    window.addEventListener("resize", adjustCanvasToPage, false);
    adjustCanvasToPage();
    slots = new Slots(0, 0);
    slots.spin();
}

function update(timestamp) {
    requestAnimationFrame(update);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(scale, scale);
    slots.update(timestamp, context);
    context.restore();
}

function click(x, y) {
    // Adjust x,y to scale
    x = Math.floor(x / scale);
    y = Math.floor(y / scale);

    // Spin only the clicked row
    slots.spinRow(Math.floor(y / STAMP_HEIGHT));

}

function adjustCanvasToPage() {
    const pageDimension = Math.min(document.body.offsetWidth, window.innerHeight);
    canvas.width = pageDimension;
    canvas.height = pageDimension;
    scale = canvas.width / (STAMP_WIDTH * WIDTH);
}

function lerp(v1, v2, t) {
    return (1 - t) * v1 + t * v2;
}

function recursiveSum(n, damp) {
    let sum = 0;
    while (n > 0) {
        sum += n;
        n -= damp;
    }
    return sum;
    //return n ? n + recursiveSum(n - damp, damp) : 0;
}


class Slots {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.slots = new Set();
        for (let row = 0; row < WIDTH; row++) {
            for (let col = 0; col < HEIGHT; col++) {
                this.slots.add(new Slot(col, row, col * STAMP_WIDTH, row * STAMP_HEIGHT));
            }
        }
    }

    update(timestamp, context) {
        context.save();
        context.translate(this.x, this.y);
        this.slots.forEach(slot => slot.update(timestamp, context));
        //context.drawImage(SLOTS_FRAME, 0, 0);
        context.restore();
    }

    spin() {
        this.slots.forEach(slot => slot.spin());
    }

    spinRow(rowNumber) {
        this.slots.forEach(slot => {
            if (slot.row === rowNumber) slot.spin();
        });
    }
}

class Slot {
    constructor(col, row, x, y) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.sy = 0;
        this.spinning = false;
        this.speed = 0;
        this.damp = 0.1;
    }

    update(timestamp, context) {
        context.save();
        context.translate(this.x, this.y);
        context.drawImage(SLOT_IMAGE, 0, this.sy, STAMP_WIDTH, STAMP_HEIGHT, 0, 0, STAMP_WIDTH, STAMP_HEIGHT);
        context.drawImage(SLOT_IMAGE, 0, this.sy - SLOT_HEIGHT, STAMP_WIDTH, STAMP_HEIGHT, 0, 0, STAMP_WIDTH, STAMP_HEIGHT);
        context.restore();
        if (this.spinning) {
            this.sy += this.speed;
            this.speed -= this.damp;
            if (this.speed < 0) {
                this.speed = 0;
                this.spinning = false;
            }
            if (this.sy >= SLOT_HEIGHT) {
                this.sy = 0;
            }
        } else {
            this.sy -= this.sy % STAMP_HEIGHT;
        }
    }

    spin() {
        this.speed = Math.random() * 5 + 2;
        this.spinning = true;
    }
}

start();