"use strict";

const canvas = document.getElementById("term");

class Display {
    constructor(columns, lines, parentEl = document.body) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d", {
            alpha: false
        });
        this.columns = columns;
        this.lines = lines;
        this.column = 0;
        this.line = 0;
        this.context.font = "16px monospace";
        this.textMetrics = this.context.measureText("█");
        this.charWidth = this.textMetrics.width;
        this.charHeight = this.textMetrics.actualBoundingBoxAscent +
            this.textMetrics.actualBoundingBoxDescent;
        this.canvas.width = this.columns * this.charWidth;
        this.canvas.height = this.lines * this.charHeight;
        this.context.font = "16px monospace"; // canvas lost state after resize.
        this.color = "white";
        this.backgroundColor = "black";
        parentEl.appendChild(this.canvas);
    }

    outChar(c) {
        const x = this.column * this.charWidth;
        const y = this.line * this.charHeight + this.charHeight;
        this.context.save();
        this.context.fillStyle = this.color;
        this.context.fillText(c, x - this.textMetrics.actualBoundingBoxLeft, y - this.textMetrics.actualBoundingBoxDescent);
        this.context.restore();
        this.column++;
        if (this.column >= this.columns) {
            this.column = 0;
            this.line++;
            if (this.line >= this.lines) {
                const page = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                this.context.save();
                this.context.fillStyle = this.backgroundColor;
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.putImageData(page, 0, -this.charHeight);
                this.context.restore();
                this.line--;
            }
        }
    }
}

const display = new Display(80, 25);
let str = "Hello, World!";
let c = 0;

function update() {
    requestAnimationFrame(update);
    display.outChar(str[c++ % str.length]);

}

update();
