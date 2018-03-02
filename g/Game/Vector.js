export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static get Zero() {
        return new Vector(0, 0);
    }
}