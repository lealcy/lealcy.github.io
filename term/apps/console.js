export default class ConsoleApp {
    static #loaded = false;
    static main(sys, args, env) {
        if (ConsoleApp.#loaded) {
            return false;
        }
        ConsoleApp.#loaded = true;
        ConsoleApp.sys = sys;
        ConsoleApp.env = env;
        env.get("input").addEventListener("change", ConsoleApp.inputEvent.bind(ConsoleApp), false);
        return true;
    }

    static clear() {
        ConsoleApp.env.get("output").textContent = "";
    }

    static write(text) {
        ConsoleApp.env.get("output").textContent += text;
    }

    static writeLine(text) {
        ConsoleApp.write(text + "\n");
    }

    static inputEvent(e) {
        let line = e.target.value.split(" ");
        let command = line.shift();
        let args = line.join(" ");
        ConsoleApp.sys.exec(command, args);
        e.target.value = "";
        e.target.focus();
    }
}