"use strict";
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d", {
    alpha: false,
});

const WIDTH = 8;
const HEIGHT = 8;

let slots;
let drawStampDimension;
let stampDimension;
let slotHeight;
const SLOT_IMAGE = new Image();
SLOT_IMAGE.onload = () => {
    stampDimension = SLOT_IMAGE.width;
    slotHeight = SLOT_IMAGE.height;
};
SLOT_IMAGE.src = "slotImage2.png";


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
    slots.update(timestamp, context);
    context.restore();
}

function click(x, y) {
    // Adjust x,y to stamp width
    x = Math.floor(x / drawStampDimension);
    y = Math.floor(y / drawStampDimension);

    // Spin only the clicked row
    slots.spinRow(y);

}

function adjustCanvasToPage() {
    const pageDimension = Math.min(document.body.offsetWidth, window.innerHeight);
    canvas.width = pageDimension;
    canvas.height = pageDimension;
    drawStampDimension = canvas.width / WIDTH;
}

class Slots {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.slots = new Set();
        for (let row = 0; row < WIDTH; row++) {
            for (let col = 0; col < HEIGHT; col++) {
                this.slots.add(new Slot(col, row));
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
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.sy = 0;
        this.spinning = false;
        this.speed = 0;
        this.damp = 0.1;
    }

    update(timestamp, context) {
        context.save();
        context.translate(this.col * drawStampDimension, this.row * drawStampDimension);
        context.imageSmoothingEnabled = false;
        context.drawImage(SLOT_IMAGE,
            0, this.sy, stampDimension, stampDimension,
            0, 0, drawStampDimension, drawStampDimension
        );
        context.drawImage(SLOT_IMAGE,
            0, this.sy - slotHeight, stampDimension, stampDimension,
            0, 0, drawStampDimension, drawStampDimension
        );
        context.restore();
        if (this.spinning) {
            this.sy += this.speed;
            this.speed -= this.damp;
            if (this.speed < 0) {
                this.speed = 0;
                this.spinning = false;
            }
            if (this.sy >= slotHeight) {
                this.sy = 0;
            }
        } else {
            this.sy -= this.sy % stampDimension;
        }
    }

    spin() {
        this.speed = Math.random() * 5 + 2;
        this.spinning = true;
    }
}

setTimeout(start, 0);