"use strict";

const srcEl = document.getElementById("src");
const dstEl = document.getElementById("dst");
const previewEl = document.getElementById("preview");
const processBtnEl = document.getElementById("process");
const messageEl = document.getElementById("message");

processBtnEl.addEventListener("click", e => process(srcEl.value));

function process(json) {
    messageEl.textContent = "";
    /*     try {
     */
    const parser = new JSONHTML;
    dstEl.textContent = parser.parse(json);
    previewEl.innerHTML = dst.textContent;
    /*     } catch (e) {
            messageEl.textContent = e.message;
        }
     */
}

class JSONHTML {
    constructor() {}

    get ch() {
        if (this.p >= this.len) {
            return null;
        }
        return this.json[this.p];
    }

    parse(json) {
        this.json = json;
        this.len = json.length;
        this.p = 0;
        this.html = "";
        this._parse();
        return this.html;
    }

    _parse() {
        this._skipWhiteSpace();
        if (this.ch === null) {
            return;
        }
        if (this.ch !== "{") {
            throw new SyntaxError(`Expected "{", got "${this.ch}" at position ${this.p}.`);
        }
        this._parseObject();
        switch (this.ch) {
            case null:
                return;
            case "{":
                this._parseObject();
                break;
            default:
        }
    }

    _parseObject() {
        this.p++; // consume "{"
        this._skipWhiteSpace();
        if (this.ch === "}") { // Empty object
            this.p++; // consume "}"
            return;
        }
        do {
            const identifier = this._parseString();
            this._skipWhiteSpace();
            if (this.ch !== ":") {
                throw new SyntaxError(`Expected ":", got "${this.ch}" while parsing object.`);
            }
            this.p++; // consume ":"
            this._skipWhiteSpace();
            if (identifier !== "") {
                this.html += `<${identifier}>`;
            }
            this._parseValue();
            if (identifier !== "") {
                this.html += `</${identifier}>`;
            }
            this._skipWhiteSpace();
            if (this.ch !== ",") {
                break;
            }
            this.p++; // consume ","
            this._skipWhiteSpace();
        } while (true);
        if (this.ch !== "}") {
            throw new SyntaxError(`Expected "}", got "${this.ch}".`);
        }
        this.p++; // consume "}"
    }

    _skipWhiteSpace() {
        while (/\s/.test(this.ch)) this.p++;
    }

    _parseString() {
        if (this.ch !== "\"") {
            throw new SyntaxError(`Expected string, got "${this.ch}" at position ${this.p}, partial: ${this.html}.`);
        }
        this.p++; // consume "\""
        let str = "";
        while (true) {
            if (this.ch === null) {
                throw new SyntaxError(`Unexpected end of string.`);
            }
            switch (this.ch) {
                case "\"":
                    this.p++; // Consume "\""
                    return str;
                case "\\":
                    this.p++;
                    if (this.ch === null) {
                        throw new SyntaxError(`Unexpected end of string while parsing escaping sequence.`);
                    }
                    switch (this.ch) {
                        case "\"":
                            str += "\"";
                            break;
                        case "\\":
                            str += "\\";
                            break;
                        case "/":
                            str += "/";
                            break;
                        case "b":
                            str += "\b";
                            break;
                        case "f":
                            str += "\f";
                            break;
                        case "n":
                            str += "\n";
                            break;
                        case "r":
                            str += "\r";
                            break;
                        case "t":
                            str += "\t";
                            break;
                        case "u":
                            let hex = "0x";
                            // consume "u"
                            for (let i = 0; i < 4; i++) {
                                this.p++;
                                if (this.ch === null) {
                                    throw new SyntaxError("Unexpected end of string while parsing escaped Unicode sequence inside a string.");
                                }
                                if (!/[0-9a-fA-F]/.test(this.ch)) {
                                    throw new SyntaxError(`Unexpected character "${this.ch}" while parsing escaped unicode sequence inside a string.`);
                                }
                                hex += this.ch;
                            }
                            str += String.fromCodePoint(parseInt(hex));
                            break;
                    }
                    this.p++;
                default:
                    str += this.ch;
                    break;
            }
            this.p++;
        }

    }

    _parseValue() {
        if (this.ch === null) {
            throw new SyntaxError("Unexpected end of string while parsing value.");
        }
        switch (this.ch) {
            case "\"":
                this.html += this._parseString();
                break;
            case "{":
                this._parseObject();
                break;
            default:
                throw new SyntaxError(`Invalid or unsupported value starting with ${this.ch}.`);
        }
    }

}