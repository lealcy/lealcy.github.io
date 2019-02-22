export default class {
    constructor(context) {
        context.console.writeLine(`Hello, world! I'm "${context.file}" app at "${context.fileWithPath}".`);
    }
}