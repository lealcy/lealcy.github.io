"use strict";

class Wall extends Tile {
    constructor(x, y) {
        super(x, y);
        this.type = "wall";
        this.color = "gray";
    }

    tileAdded(tileBoard, tile) {
        this.updateWallImage(tileBoard);
    }

    tileRemoved(tileBoard, tile) {
        this.updateWallImage(tileBoard);
    }

    updateWallImage(tileBoard) {
        let neigh = tileBoard.getNeighbours(this.x, this.y);
        let config = "" +
            (neigh.top && neigh.top.type === "wall" ? 1 : 0) +
            (neigh.right && neigh.right.type === "wall" ? 1 : 0) +
            (neigh.bottom && neigh.bottom.type === "wall" ? 1 : 0) +
            (neigh.left && neigh.left.type === "wall" ? 1 : 0);
        switch (config) {
            case "0000":
                this.image = "wall_unique_tile";
                break;
            case "0001":
                this.image = "wall_down_right_corner";
                break
            case "0010":
                this.image = "wall_tip_up";
                break;
            case "0011":
                this.image = "wall_top_right_corner";
                break;
            case "0100":
                this.image = "wall_down_left_corner";
                break;
            case "0101":
                this.image = "wall_horizontal_sides";
                break
            case "0110":
                this.image = "wall_top_left_corner";
                break;
            case "0111":
                this.image = "wall_top_turnabout";
                break;
            case "1000":
                this.image = "wall_tip_down";
                break;
            case "1001":
                this.image = "wall_down_right_corner";
                break
            case "1010":
                this.image = "wall_vertical_sides";
                break;
            case "1011":
                this.image = "wall_top_right_corner";
                break;
            case "1100":
                this.image = "wall_down_left_corner";
                break;
            case "1101":
                this.image = "wall_horizontal_sides";
                break
            case "1110":
                this.image = "wall_top_left_corner";
                break;
            case "1111":
                this.image = "wall_top_turnabout";
                break;

        }
    }

    static addWall(tb, bx, by, ex, ey) {
        let x1 = Math.min(bx, ex);
        let y1 = Math.min(by, ey);
        let x2 = Math.max(bx, ex);
        let y2 = Math.max(by, ey);

        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                if (x === x1 || x === x2 || y === y1 || y === y2) {
                    tb.add(new Wall(x, y));
                }
            }
        }
    }
}