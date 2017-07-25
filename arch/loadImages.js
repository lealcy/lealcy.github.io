"use strict";

function loadImages(images, ctx, cb) {
    let loadedImages = 0;
    let totalImages = Object.keys(images).length;
    for (let i in images) {
        images[i].img.addEventListener("load", e => {
            loadedImages++;
            if (loadedImages === totalImages) {
                cb();
            } else {
                window.requestAnimationFrame(() => loadImagesUpdate(ctx, loadedImages, totalImages));
            }
        });
        images[i].img.src = images[i].file;

    }
}

function loadImagesUpdate(ctx, loadedImages, totalImages) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let text = `Loading images: ${loadedImages} of ${totalImages}.`;
    ctx.fillText(text, 10, 20);
}