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
        this.tiles.forEach(v => v && v.tileAdded(this, tile));
        return id;
    }

    removeTileAt(x, y) {
        let tile = this.tiles[this.getId(x, y)];
        this.tiles[this.getId(x, y)] = new Tile(x, y);
        this.tiles.forEach(v => v && v.tileRemoved(this, tile));
    }

    update(ctx) {
        this.tiles.forEach(v => v && v.update(ctx));
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
        let tile;
        if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
            return undefined;
        }
        let id = this.getId(x, y);
        if (this.tiles[id] === undefined) {
            tile = new Tile(x, y);
            this.add(tile);
            return tile;
        }
        return this.tiles[id];
    }

    getId(x, y) {
        return y * this.width + x;
    }

    getTileId(tile) {
        return tile.y * this.width + tile.x;
    }

    getTileById(id) {
        return this.tiles[id];
    }

    getRandomTile() {
        return this.getTileAt(
            Math.floor(Math.random() * this.width),
            Math.floor(Math.random() * this.height)
        );
    }

    clear() {
        this.tiles = [];
    }

}