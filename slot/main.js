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
    slots.spin();
}

function adjustCanvasToPage() {
    const pageDimension = Math.min(document.body.offsetWidth, window.innerHeight);
    canvas.width = pageDimension;
    canvas.height = pageDimension;
    scale = canvas.width / (STAMP_WIDTH * WIDTH);
}

class Slots {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.slots = new Set();
        for (let line = 0; line < WIDTH; line++) {
            for (let col = 0; col < HEIGHT; col++) {
                this.slots.add(new Slot(col * STAMP_WIDTH, line * STAMP_HEIGHT));
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
}

class Slot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sy = 0;
        this.spinning = false;
        this.speed = 0;
        this.damp = 0.01;
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
                /*                 const mod = this.sy % STAMP_HEIGHT;
                                if (mod > STAMP_HEIGHT / 2) {
                                    this.sy += mod;
                                } else if (mod <= STAMP_HEIGHT / 2) {
                                    this.sy -= mod;
                                }
                 */
                this.speed = 0;
                this.spinning = false;
            }
            if (this.sy >= SLOT_HEIGHT) {
                this.sy = 0;
            }
        }
    }

    spin() {
        this.speed = Math.random() * 2 + 2;
        this.spinning = true;
    }
}

start();