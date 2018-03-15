"use strict";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false,
});
const SLOT_IMAGE = new Image();
SLOT_IMAGE.src = "slotImage.png";
const SLOTS_FRAME = new Image();
SLOTS_FRAME.src = "slotsFrame.png";
let SLOT_WIDTH = 16,
    SLOT_HEIGHT = 96,
    STAMP_WIDTH = 16,
    STAMP_HEIGHT = 16;

let slots;

function start() {
    requestAnimationFrame(update);
    context.imageSmoothingEnabled = false;
    slots = new Slots(7, 7, 6);
}

function update(timestamp) {
    requestAnimationFrame(update);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    slots.update(timestamp, context);
}

class Slots {
    constructor(x, y, scale = 1) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.slots = new Set([
            new Slot(4, 4),
            new Slot(SLOT_WIDTH + 8, 4),
            new Slot(2 * SLOT_WIDTH + 12, 4),
            new Slot(3 * SLOT_WIDTH + 16, 4),
            new Slot(4 * SLOT_WIDTH + 20, 4),
        ]);
    }

    update(timestamp, context) {
        context.save();
        context.translate(this.x, this.y);
        context.scale(this.scale, this.scale);
        this.slots.forEach(slot => slot.update(timestamp, context));
        context.drawImage(SLOTS_FRAME, 0, 0);
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
                                } */

                this.speed = 0;
                this.spinning = false;
            }
            if (this.sy >= SLOT_HEIGHT) {
                this.sy = 0;
            }
        }
    }

    spin() {
        this.speed = Math.random() * 5 + 5;
        this.spinning = true;
    }
}

start();