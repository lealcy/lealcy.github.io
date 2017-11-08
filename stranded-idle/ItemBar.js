import { createFromTemplate, shortNumber } from "./helpers.js";
import { categories } from "./categories.js";

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
            tabEl.innerText = categories[category];
            tabEl.dataset.selected = checked;
            tabEl.addEventListener("click", e => {
                e.stopPropagation();
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
                if (!item.visible) {
                    itemEl.style.display = "none";
                }
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
                if (item.cost.size) {
                    const costEl = itemEl.querySelector(".cost");
                    costEl.style.display = "flex";
                    for (const [id, quantity] of item.cost) {
                        const costItem = items.get(id);
                        const costItemEl = createFromTemplate("resourceCostItemTemplate");
                        costItemEl.querySelector(".image").src = `images/${costItem.image}.png`;
                        costItemEl.querySelector(".quantity").innerText = quantity;
                        costEl.appendChild(costItemEl);
                    }
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
        const id = `tabItem_${item.id}`;
        const itemEl = document.getElementById(id);

        if (!item.active && ((item.craftable && item.canCraft()) || item.quantity)) {
            item.active = true;
            itemEl.style.display = "grid";
            const tabNameEl = document.getElementById(`tab_${item.category}`);
            tabNameEl.style.display = "block";
            tabNameEl.className = tabNameEl.className.replace(" blink", "");
            setTimeout(() => tabNameEl.className += " blink", 1);
            //itemEl.style.opacity = 1.0;
        }

        itemEl.querySelector(`#${id} > .quantity`).innerText = item.quantity > 0 && item.quantity < 1 ? "< 1" : shortNumber((item.quantity + item.inUse) | 0);
    }
}