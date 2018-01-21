import { Oscilloscope } from "./Oscilloscope.js";

const o = new Oscilloscope(640, 480);
o.appendTo(document.body);

let p = 0;

function update() {
    requestAnimationFrame(update);
    o.point(p += Math.random() - 0.5);
}

update();