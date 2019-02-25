"use strict";

const output = document.getElementById("output");
const input = document.getElementById("input");

class Console {
    constructor(input, output) {
        this.input = input;
        this.output = output;

        this.input.addEventListener("change", this.inputEvent.bind(this), false);
    }

    write(text) {
        this.output.textContent += text;
    }

    writeLine(text) {
        this.write(text + "\n");
    }

    inputEvent(e) {
        this.executeScriptFile(e.target.value);
        e.target.value = "";
    }

    executeScriptFile(file) {
        const fileWithPath = `./apps/${file}.js`;
        import(fileWithPath).then(module => {
            new module.default(new Context(this, file, fileWithPath, module))
        }).catch(error => {
            this.writeLine(error);
        });

    }
}

class Context {
    constructor(console, file, fileWithPath, instance) {
        this.console = console;
        this.file = file;
        this.fileWithPath = fileWithPath;
        this.instance = instance;
    }
}

const console = new Console(input, output);

console.writeLine("Type 'hello'.");