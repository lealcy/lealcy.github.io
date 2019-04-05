"use strict";

class Application {
    constructor() {
        this._mainWindow = new Window("Unnamed Window");
    }
    
    run() {
        document.body.appendChild(this._mainWindow.generateHTML());
    }
    
    get mainWindow() { return this._mainWindow; }
    set mainWindow(window) { this._mainWindow = window instanceof Window ? window : null; }
}

class Window {
    constructor(title = "") {
        this._title = title;
    }
    
    generateHTML() {
        const div = document.createElement("div");
        div.classList.add("widget");
        div.classList.add("window");
        const title = document.createElement("div");
        div.classList.add("widget");
        title.classList.add("title");
        title.textContent = this._title;
        div.appendChild(title);
        return div;
    }
}

const app = new Application();
app.run();
