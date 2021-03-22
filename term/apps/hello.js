export default class {
    static main(sys, args, env) {
        sys.con.writeLine(`Hello, ${args === "" ? "World" : args}! I'm the "${env.get("file")}" app at "${env.get("fileWithPath")}".`);
        return true;
    }
}