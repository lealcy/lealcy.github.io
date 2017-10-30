import { createFromTemplate, shortNumber } from "./helpers.js";

export default class ItemBar {
    constructor(containerEl, items) {
        this.containerEl = containerEl;
        this.items = new Map;
        for (const [id, item] of items) {
            if (!this.items.has(item.category)) {
                this.items.set(item.category, new Set);
            }
            this.items.get(item.category).add(item);
        }

        const itemBarTabs = document.createElement("div");
        itemBarTabs.id = "itemBarTabs";
        const itemBarContentEl = document.createElement("div");
        itemBarContentEl.id = "itemBarContent";

        let checked = true;
        for (const [category, categoryItems] of this.items) {
            const tabEl = document.createElement("div");
            tabEl.id = `tab_${category}`;
            tabEl.className = "tabName";
            tabEl.style.display = "none";
            tabEl.innerText = category;
            tabEl.dataset.selected = checked;
            tabEl.addEventListener("click", e => {
                Array.from(document.getElementsByClassName("tabName")).forEach(element => {
                    element.dataset.selected = false;
                });
                Array.from(document.getElementsByClassName("tabContent")).forEach(element => {
                    element.style.display = "none";
                    element.dataset.selected = false;
                });
                document.getElementById(`tab_${category}`).dataset.selected = true;
                document.getElementById(`tabContent_${category}`).style.display = "flex";
            });
            itemBarTabs.appendChild(tabEl);

            const tabContentEl = document.createElement("div");
            tabContentEl.id = `tabContent_${category}`;
            tabContentEl.className = "tabContent";
            if (!checked) {
                tabContentEl.style.display = "none";
            }
            for (const item of categoryItems) {
                const itemEl = createFromTemplate("resourceTemplate");
                itemEl.id = `tabItem_${item.id}`;
                itemEl.className += " tabItem " + (item.craftable ? "craftable" : "nonCraftable");
                itemEl.style.display = "none";
                const itemImageEl = itemEl.querySelector(".image");
                itemImageEl.src = `images/${item.image}.png`;
                if (item.craftable) {
                    itemImageEl.addEventListener("click", e => {
                        e.stopPropagation();
                        item.handcraft();
                    });
                } else {
                    itemImageEl.style.opacity = 0.5;
                }
                itemEl.querySelector(".name").innerText = item.name;
                tabContentEl.appendChild(itemEl);
            }
            itemBarContentEl.appendChild(tabContentEl);
            checked = false;
        }
        this.containerEl.appendChild(itemBarTabs);
        this.containerEl.appendChild(itemBarContentEl);
    }

    update(item) {
        const itemEl = document.getElementById(`tabItem_${item.id}`);

        if (!item.active) {
            if ((item.craftable && item.canCraft()) || (!item.craftable && item.hasMachinery() && item.canCraft())) {
                item.active = true;
                itemEl.style.display = "grid";
                const tabNameEl = document.getElementById(`tab_${item.category}`);
                tabNameEl.style.display = "block";
                tabNameEl.dataset.animate = true;
                //itemEl.style.opacity = 1.0;
            }
        }

        itemEl.querySelector(".quantity").innerText = item.quantity > 0 && item.quantity < 1 ? "< 1" : shortNumber(item.quantity | 0);
    }
}