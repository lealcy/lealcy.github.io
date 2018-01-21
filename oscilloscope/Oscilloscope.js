

export class Oscilloscope {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { alpha: false });
        this.smallerValue = 0;
        this.biggerValue = 0;
        this.points = [];
    }

    get width() {
        return this.canvas.width;
    }

    set width(value) {
        this.canvas.width = value;
    }

    get height() {
        return this.canvas.height;
    }

    set height(value) {
        this.canvas.height = value;
    }

    appendTo(element) {
        element.appendChild(this.canvas);
    }

    point(value) {
        this.points.push(value);
        if (this.points.length > this.canvas.width) {
            this.points.shift();
        }
        this.smallerValue = Math.min(this.smallerValue, value);
        this.biggerValue = Math.max(this.biggerValue, value);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "yellow";
        this.context.beginPath();
        this.points.forEach((v, i) => {
            const point = Math.floor(map(v, this.smallerValue, this.biggerValue, this.canvas.height, 0));
            if (!i) {
                this.context.moveTo(i, point);
            } else {
                this.context.lineTo(i, point);
            }
        })
        this.context.stroke();
    }
}

function map(value, r1Min, r1Max, r2Min, r2Max) {
    return (value - r1Min) * (r2Max - r2Min) / (r1Max - r1Min) + r2Min;
};
