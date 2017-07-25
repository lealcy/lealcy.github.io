"use strict";

class Tile {
    constructor(x, y) {
        this.type = "tile";
        this.color = "lightgray";
        this.image = "tile";
        this.x = x;
        this.y = y;
        this.tileX = this.x * TILE_WIDTH;
        this.tileY = this.y * TILE_HEIGHT;
    }

    update() {
        if (images[this.image] !== undefined) {
            ctx.drawImage(images[this.image].img, this.tileX, this.tileY, TILE_WIDTH, TILE_HEIGHT);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.tileX, this.tileY, TILE_WIDTH, TILE_HEIGHT);
        }
    }

    tileAdded(tileBoard, tile) {
        // This function is called every time a tile is added to the TileBoard.
    }
}