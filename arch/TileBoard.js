"use strict";

class TileBoard {
    constructor(width, height) {
        this.tiles = [];
    }

    add(tile) {
        for (let i = 0, j = this.tiles.length; i < j; i++) {
            if (this.tiles[i].x === tile.x && this.tiles[i].y === tile.y) {
                // Tile already exist.
                return false;
            }
        }
        this.tiles.push(tile);
        return true;
    }

    update(ctx) {
        this.tiles.forEach(v => v.update(ctx));
    }
}