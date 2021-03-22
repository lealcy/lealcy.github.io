export default class ClearApp {
    static main(sys, args, env) {
        sys.con.clear();
        return true;
    }
}