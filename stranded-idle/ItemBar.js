import { createFromTemplate, shortNumber } from "./helpers.js";
import { categories } from "./categories.js";

export default class ItemBar {
    constructor(containerEl, items) {
        this.containerEl = containerEl;
        this.items = new Map;
        this.allItems = new Set;
        for (const [id, item] of items) {
            if (!this.items.has(item.category)) {
                this.items.set(item.category, new Set);
            }
            this.items.get(item.category).add(item);
            this.allItems.add(item);
        }

        this.createTabs();

    }

    createTabs() {
        const itemBarTabs = document.createElement("div");
        itemBarTabs.id = "itemBarTabs";
        const itemBarContentEl = document.createElement("div");
        itemBarContentEl.id = "itemBarContent";

        itemBarTabs.appendChild(this.createTab("all", "All", true));
        itemBarContentEl.appendChild(this.createTabContent("all", this.allItems, true));
        for (const [category, categoryItems] of this.items) {
            itemBarTabs.appendChild(this.createTab(category, categories[category]));
            itemBarContentEl.appendChild(this.createTabContent(category, categoryItems));
        }
        this.containerEl.appendChild(itemBarTabs);
        this.containerEl.appendChild(itemBarContentEl);
    }

    createTab(id, name, checked = false) {
        const tabEl = document.createElement("div");
        tabEl.id = `tab_${id}`;
        tabEl.className = "tabName";
        if (!checked) {
            tabEl.style.display = "none";
        }
        tabEl.innerText = name;
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
            document.getElementById(`tab_${id}`).dataset.selected = true;
            document.getElementById(`tabContent_${id}`).style.display = "flex";
        });
        return tabEl;

    }

    createTabContent(id, items, checked = false) {
        const tabContentEl = document.createElement("div");
        tabContentEl.id = `tabContent_${id}`;
        tabContentEl.className = "tabContent";
        if (!checked) {
            tabContentEl.style.display = "none";
        }
        for (const item of items) {
            const itemEl = createFromTemplate("resourceTemplate");
            itemEl.id = `tabItem_${id}_${item.id}`;
            itemEl.className += ` tabItem_${item.id} tabItem ${item.craftable ? "craftable" : "nonCraftable"}`;
            itemEl.style.display = "none";
            itemEl.style.backgroundImage = `url(images/${item.image}.png)`;
            if (item.craftable) {
                itemEl.addEventListener("click", e => {
                    e.stopPropagation();
                    item.handcraft();
                });
            }
            if (item.cost.size) {
                /*const costEl = itemEl.querySelector(".cost");
                costEl.style.display = "flex";
                for (const [id, quantity] of item.cost) {
                    const costItem = items.get(id);
                    const costItemEl = createFromTemplate("resourceCostItemTemplate");
                    costItemEl.querySelector(".image").src = `images/${costItem.image}.png`;
                    costItemEl.querySelector(".quantity").innerText = quantity;
                    costEl.appendChild(costItemEl);
                }*/
            }
            itemEl.querySelector(".name").innerText = item.name;
            tabContentEl.appendChild(itemEl);
        }
        return tabContentEl;
    }

    update(item) {
        const itemClass = `.tabItem_${item.id}`;
        const itemEls = document.querySelectorAll(itemClass);

        //if (!item.active && (((item.craftable && item.canCraft()) || item.quantity || item.attendRequirements()))) {
        if (!item.active && (item.visible || item.attendRequirements())) {
            item.active = true;
            itemEls.forEach(i => i.style.display = "flex");
            const tabNameEl = document.getElementById(`tab_${item.category}`);
            tabNameEl.style.display = "block";
            tabNameEl.className = tabNameEl.className.replace(" blink", "");
            setTimeout(() => tabNameEl.className += " blink", 1);
            //itemEl.style.opacity = 1.0;
        }

        document.querySelectorAll(`${itemClass} > .quantity`).forEach(i => i.innerText = item.quantity > 0 && item.quantity < 1 ? "< 1" : shortNumber((item.quantity + item.inUse)));
    }
}