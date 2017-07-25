"use strict";

class Wall extends Tile {
    constructor(x, y) {
        super(x, y);
        this.type = "wall";
        this.color = "gray";
    }
}