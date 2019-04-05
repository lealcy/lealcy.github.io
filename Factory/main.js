"use strict";

class Application {
    constructor() {
        this._mainWindow = new Window();
    }
    
    get mainWindow() { return this._mainWindow; }
    set mainWindow(window) { this._mainWindow = window instanceof Window ? window : null; }
}

class Window {
    constructor(title = "") {
        this._title = title;
    }
}
