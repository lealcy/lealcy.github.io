"use strict";

class TileBoard {
    constructor(width, height) {
        this.tiles = [];
        this.width = width;
        this.height = height;
    }

    add(tile) {
        let id = this.getTileId(tile);
        this.tiles[id] = tile;
        this.tiles.forEach(v => v.tileAdded(this, tile));
        return id;
    }

    update(ctx) {
        this.tiles.forEach(v => v.update(ctx));
    }

    getNeighbours(x, y) {
        return {
            top: this.getTileAt(x, y - 1),
            right: this.getTileAt(x + 1, y),
            bottom: this.getTileAt(x, y + 1),
            left: this.getTileAt(x - 1, y),
        };

    }

    getTileAt(x, y) {
        let id = this.getId(x, y);
        if (this.tiles[id] === undefined) {
            return new Tile(x, y);
        }
        return this.tiles[id];
    }

    getId(x, y) {
        return x * this.width + y;
    }

    getTileId(tile) {
        return tile.x * this.width + tile.y;
    }

}