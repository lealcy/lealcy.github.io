"use strict";

const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const maxSkidMarks = 200;

const terrain = new Image();
terrain.src = "terrain.jpg";
const tank = new Image();
tank.src = "tank.png";
const skidMark = new Image();
skidMark.src = "skidmark2.png";

let keys = {};
body.addEventListener("keydown", (e) => keys[e.key] = true, false);
body.addEventListener("keyup", (e) => keys[e.key] = false, false);

class Vehicle {
    constructor(x, y, sprite, scale) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.angle = 0;
        this.scale = scale;
        this.skidMarks = [];
    }

    update() {
        let oldAngle = this.angle;
        let oldX = this.x;
        let oldY = this.y;
        if (keys.ArrowRight === true) {
            this.angle += keys.ArrowDown === true ? -0.03 : 0.06;
        }
        if (keys.ArrowLeft === true) {
            this.angle += keys.ArrowDown === true ? 0.03 : -0.06;
        }
        if (keys.ArrowUp === true) {
            let newX = this.x + 3 * Math.cos(this.angle);
            let newY = this.y + 3 * Math.sin(this.angle);
            if (newX > 0 && newX < canvas.width) {
                this.x = newX;
            }
            if (newY > 0 && newY < canvas.height) {
                this.y = newY;
            }

        }
        if (keys.ArrowDown === true) {
            let newX = this.x + -2 * Math.cos(this.angle);
            let newY = this.y + -2 * Math.sin(this.angle);
            if (newX > 0 && newX < canvas.width) {
                this.x = newX;
            }
            if (newY > 0 && newY < canvas.height) {
                this.y = newY;
            }
        }

        if (oldX !== this.x || oldY !== this.y || oldAngle !== this.angle) {
            this.skidMarks.push({ x: oldX, y: oldY, angle: oldAngle });
            if (this.skidMarks.length > maxSkidMarks) {
                this.skidMarks.shift();
            }
        }

    }

    draw() {
        for (let sm of this.skidMarks) {
            ctx.save();
            ctx.translate(sm.x, sm.y);
            ctx.rotate(sm.angle);
            ctx.drawImage(
                skidMark, -skidMark.width * this.scale / 2, -skidMark.height * this.scale / 2,
                skidMark.width * this.scale,
                skidMark.height * this.scale);
            ctx.restore();
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
            this.sprite, -this.sprite.width * this.scale / 2, -this.sprite.height * this.scale / 2,
            this.sprite.width * this.scale,
            this.sprite.height * this.scale);
        ctx.restore();
    }
}

const vehicle = new Vehicle(canvas.width / 2, canvas.height / 2, tank, 0.3);

function start() {
    window.requestAnimationFrame(update);

}

function update() {
    window.requestAnimationFrame(update);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(terrain, 0, 0, 800, 600);

    vehicle.update();
    vehicle.draw();
}

start();