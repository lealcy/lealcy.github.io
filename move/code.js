"use strict";

const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const vehicleScale = 0.3;
const maxSkidMarks = 200;
const maxSpeed = 3;
const accel = 0.05;
const shotCooldown = 10;
const projectileSpeed = 6;
const SERVER_ADDRESS = "ws://localhost:8181";

const terrain = new Image();
terrain.src = "terrain.jpg";
const tank = new Image();
tank.src = "tank.png";
const skidMark = new Image();
skidMark.src = "skidmark2.png";
const projectile = new Image();
projectile.src = "projectile.png";
const dummy = new Image();
dummy.src = "dummy.png";

let clientName;
let singlePlayer = true;
let ws;
let connectionId;
let clients = {};
let keys = {};


class Dummy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 0.2;
    }

    update() {

    }

    draw() {
        ctx.drawImage(
            dummy,
            this.x - dummy.width * this.scale / 2,
            this.y - dummy.height * this.scale / 2,
            dummy.width * this.scale,
            dummy.height * this.scale
        );
    }

    hit(x, y) {
        let dx = this.x - dummy.width * this.scale / 2;
        let dy = this.y - dummy.height * this.scale / 2;
        let dw = dummy.width * this.scale;
        let dh = dummy.height * this.scale;
        return x >= dx && y >= dy && x < dx + dw && y < dy + dh;
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.scale = 0.15;
    }

    update() {
        this.x += projectileSpeed * Math.cos(this.angle);
        this.y += projectileSpeed * Math.sin(this.angle);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
            projectile, -projectile.width * this.scale / 2, -projectile.height * this.scale / 2,
            projectile.width * this.scale,
            projectile.height * this.scale
        );
        ctx.restore();
    }

    offScreen() {
        return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
    }
}

class Vehicle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.sprite = tank;
        this.angle = angle;
        this.scale = vehicleScale;
        this.skidMarks = [];
        this.speed = 0;
        this.projectiles = [];
        this.cooldown = 0;
        this.shot = false;
    }

    update(data) {
        this.x = data.x;
        this.y = data.y;
        this.angle = data.angle;
        this.speed = data.speed;
        /*if (this.keys[" "] === true) {
            if (!this.shot) {
                if (this.cooldown <= 0) {
                    this.projectiles.push(
                        new Projectile(this.x, this.y, this.angle)
                    );
                    this.cooldown = shotCooldown;
                    this.shot = true;
                }
            }
        } else {
            this.shot = false;
        }

        this.cooldown--;
        this.projectiles.forEach((p, i) => {
            p.update();
            if (p.offScreen()) {
                this.projectiles.splice(i, 1);
                return;
            }
            if (target.hit(p.x, p.y)) {
                target.x = Math.floor(Math.random() * canvas.width);
                target.y = Math.floor(Math.random() * canvas.height);
                this.projectiles.splice(i, 1);
                return;
            }
        });

        let oldAngle = this.angle;
        let oldX = this.x;
        let oldY = this.y;
        if (this.keys.ArrowRight === true) {
            this.angle += this.keys.ArrowDown === true ? -0.03 : 0.06;
        }
        if (this.keys.ArrowLeft === true) {
            this.angle += this.keys.ArrowDown === true ? 0.03 : -0.06;
        }
        if (this.keys.ArrowUp === true) {
            if (this.speed < maxSpeed) {
                this.speed += accel;
                if (this.speed > maxSpeed) {
                    this.speed = maxSpeed;
                }
            }
        } else {
            if (this.speed > 0 || this.keys.ArrowDown === true) {
                this.speed -= accel * 2;
                if (this.speed < -(maxSpeed / 2)) {
                    this.speed = -(maxSpeed / 2);
                }
            } else if (this.keys.ArrowDown === false && this.speed < 0) {
                this.speed += accel * 5;
                if (this.speed > 0) {
                    this.speed = 0;
                }
            }
        }
        let newX = this.x + this.speed * Math.cos(this.angle);
        let newY = this.y + this.speed * Math.sin(this.angle);
        if (newX > 0 && newX < canvas.width) {
            this.x = newX;
        }
        if (newY > 0 && newY < canvas.height) {
            this.y = newY;
        }
        if (oldX !== this.x || oldY !== this.y || oldAngle !== this.angle) {
            this.skidMarks.push({ x: oldX, y: oldY, angle: oldAngle });
            while (this.skidMarks.length > maxSkidMarks) {
                this.skidMarks.shift();
            }
        }*/
    }

    draw() {
        for (let sm of this.skidMarks) {
            ctx.save();
            ctx.translate(sm.x, sm.y);
            ctx.rotate(sm.angle);
            ctx.drawImage(
                skidMark, -skidMark.width * this.scale / 2, -skidMark.height * this.scale / 2,
                skidMark.width * this.scale,
                skidMark.height * this.scale
            );
            ctx.restore();
        }
        this.projectiles.forEach(p => p.draw());
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
            this.sprite, -this.sprite.width * this.scale / 2, -this.sprite.height * this.scale / 2,
            this.sprite.width * this.scale,
            this.sprite.height * this.scale
        );
        ctx.restore();
    }

    keyDown(key) {
        this.keys[key] = true;
        console.log("keyDown", this.keys);
    }

    keyUp(key) {
        this.keys[key] = false;
        console.log("keyUp", this.keys);
    }
}

//const vehicle = new Vehicle(canvas.width / 2, canvas.height / 2, tank, 0.3);
const target = new Dummy(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height)
);

function send(data) {
    data = JSON.stringify(data);
    ws.send(data);
    console.log("sent: ", data)
}

function receive(data) {
    console.log("received:", data);
    data = JSON.parse(data);
    switch (data.cmd) {
        case "clientConnected":
            if (data.clientName === clientName && !connectionId) {
                connectionId = data.id;
            }
            clients[data.id] = new Vehicle(data.x, data.y, data.angle);
            break;
        case "keydown":
            clients[data.id].keyDown(data.key);
            break;
        case "keyup":
            clients[data.id].keyUp(data.key);
            break;
        case "update":
            clients[data.id].update(data);
            break;
        case "clientDisconnected":
            delete clients[data.id];
        default:
            console.log("Command not implemented.");
            break;
    }
}

function wsConnect() {
    ws = new WebSocket(SERVER_ADDRESS);

    ws.onerror = function(e) {};

    ws.onopen = function(e) {
        console.log("Connected", e);
        singlePlayer = false;
        send({ cmd: "hello", clientName });
    };

    ws.onmessage = function(e) {
        receive(e.data);
    };
    ws.onclose = function(e) {
        singlePlayer = true;
        clients = {};
        setTimeout(wsConnect, 3000);
    };
}

function start() {

    while (!clientName || clientName.trim() === "") {
        clientName = prompt("Type your name", `Guest${Math.round(Math.random() * 10000000)}`);
    }

    wsConnect();

    body.addEventListener("keydown", e => send({ cmd: "keydown", key: e.key }), false);
    body.addEventListener("keyup", e => send({ cmd: "keyup", key: e.key }), false);

    window.requestAnimationFrame(update);
}

function update() {
    window.requestAnimationFrame(update);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(terrain, 0, 0, canvas.width, canvas.height);

    /*for (let i in clients) {
        send({ cmd: "update" });
        //clients[i].update();
    }*/

    //vehicle.update();
    target.update();

    for (let i in clients) {
        clients[i].draw();
    }

    //vehicle.draw();
    target.draw();

}



start();