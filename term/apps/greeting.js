export default class GreetingApp {
    static main(sys, args, env) {
        sys.con.writeLine("Welcome, type 'help' for help.");
        return true;
    }
}