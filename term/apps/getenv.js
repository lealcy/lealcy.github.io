export default class GetEnvApp {
    static main(sys, args, env) {
        if (args === "") {
            sys.env.forEach((v, i) => {
                sys.con.writeLine(`${i}=${v}`);
            });
            return true;
        }
        sys.con.writeLine(`${args}=${sys.env.get(args)}`);
    }
}