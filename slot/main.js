"use strict";

document.addEventListener("click", e => slots.spin(), false);

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false,
});
const SLOT_IMAGE = new Image();
SLOT_IMAGE.src = "slotImage.png";
const SLOTS_FRAME = new Image();
SLOTS_FRAME.src = "slotsFrame.png";
const SLOT_HEIGHT = 96,
    STAMP_WIDTH = 16,
    STAMP_HEIGHT = 16,
    SCALE = 5,
    WIDTH = 8,
    HEIGHT = 8,
    FRAME_MARGIN = 4;

const CANVAS_WIDTH = (STAMP_WIDTH * WIDTH + FRAME_MARGIN * 2) * SCALE;
const CANVAS_HEIGHT = (STAMP_HEIGHT * HEIGHT + FRAME_MARGIN * 2) * SCALE;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let slots;

function start() {
    requestAnimationFrame(update);
    context.imageSmoothingEnabled = false;
    slots = new Slots(0, 0, SCALE);
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
        this.slots = new Set();
        for (let line = 0; line < 8; line++) {
            for (let col = 0; col < 8; col++) {
                this.slots.add(new Slot(col * STAMP_WIDTH, line * STAMP_HEIGHT));
            }
        }
    }

    update(timestamp, context) {
        context.save();
        context.translate(this.x, this.y);
        context.scale(this.scale, this.scale);
        context.translate(FRAME_MARGIN, FRAME_MARGIN);
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