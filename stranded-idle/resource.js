import { createFromTemplate } from "./helpers.js";
import { message } from "./message.js";
import { items } from "./items.js";

export function createResourceItem(item, elementId = "", elementClasses = "", defaultDisplayStyle = "flex") {
    const itemEl = createFromTemplate("resourceTemplate");
    itemEl.id = elementId;
    itemEl.className += ` ${elementClasses} ${item.craftable ? "craftable" : "nonCraftable"}`;
    itemEl.style.display = defaultDisplayStyle;
    itemEl.style.backgroundImage = `url(images/${item.image}.png)`;
    if (!item.craftable) {
        itemEl.dataset.notHandcraftable = true;
    }
    itemEl.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        if (item.craftable) {
            if (!item.handcraft()) {
                message("Not enough material.");
            }
        } else {
            message("This item is not handcraftable.");
        }
    });
    itemEl.addEventListener("mouseenter", e => {
        let msg = `"${item.description}"`;
        if (item.cost.size) {
            msg += " (";
            for (const [id, quantity] of item.cost) {
                const costItem = items.get(id);
                msg += ` <img height=16 src="images/${costItem.image}.png">x${quantity} `;
            }
            msg += ")";
        }
        message(msg);
    });
    itemEl.querySelector(".name").innerText = item.name;
    return itemEl;
}