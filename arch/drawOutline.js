"use strict";

function drawOutline(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
    let x = Math.min(x1, x2) * TILE_WIDTH;
    let y = Math.min(y1, y2) * TILE_HEIGHT;
    let w = Math.max(x1, x2) * TILE_WIDTH + TILE_WIDTH - x;
    let h = Math.max(y1, y2) * TILE_HEIGHT + TILE_HEIGHT - y;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}