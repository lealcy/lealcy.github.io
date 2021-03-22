"use strict";

const input = document.getElementById("input");
const output = document.getElementById("output");
const DEFAULT_EXEC_PATH = "./apps";

import console from "./apps/console.js";

class System {
    env = new Map([
        ["exec_path", DEFAULT_EXEC_PATH],
    ]);

    constructor(inout, output) {
        this.env.set("input", input);
        this.env.set("output", output);
        this.con = console;
        this.con.main(this, "", this.env);
    }

    exec(file, args = "") {
        const localEnv = new Map(this.env);
        localEnv.set("file", file);
        localEnv.set("fileWithPath", `${this.env.get("exec_path")}/${file}.js`);
        import(localEnv.get("fileWithPath"))
            .then(module => {
                localEnv.set("app", module.default);
                module.default.main(this, args, localEnv);
            })
            .catch(error => {
                // console.log(error);
                this.con.writeLine(`'${localEnv.get("file")}' is not an app in the '${localEnv.get("exec_path")}' directory.`);
                //this.con.writeLine(error);
            });
    }
}

const sys = new System(input, output);

sys.exec("greeting");