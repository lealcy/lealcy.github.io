"use strict";

function enc(text, cypherPool) {
    let cypher = "";
    for (let i = 0; i < text.length; i++) {
        cypher += cypherPool.getCharKey(text.charCodeAt(i));
    }
    return btoa(cypher);
}

function dec(cypher, cypherPool) {
    const bcypher = atob(cypher);
    let text = "";

    let p = 0;
    next: while (p < bcypher.length) {
        for (let keySize = cypherPool.minKeySize; keySize <= cypherPool.maxKeySize; keySize++) {
            const key = bcypher.substr(p, keySize);
            let charCode = cypherPool.getChar(key);
            if (charCode === null) {
                continue;
            }
            text += String.fromCharCode(charCode);
            p += keySize;
            continue next;
        }
        throw new Error("not found!");
        break;
    }
    return text;
}

function hashCode(str) {
    let hash = 0,
        i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        // hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

class SeededRandom {
    constructor(seed = Math.random()) {
        this.seed = seed;
    }
    next() {
        this.seed = Math.sin(this.seed) * 10000;
        return this.seed - Math.floor(this.seed);

    }
    nextIntBetween(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }
}

class CypherPool {
    constructor(seed, firstCharCode, lastCharCode, nKeysPerChar, minKeySize, maxKeySize) {
        const now = performance.now();
        this.rand = new SeededRandom(seed);
        this.firstCharCode = firstCharCode;
        this.lastCharCode = lastCharCode;
        this.nKeysPerChar = nKeysPerChar;
        this.minKeySize = minKeySize;
        this.maxKeySize = maxKeySize;
        this.poolSize = (lastCharCode - firstCharCode) * nKeysPerChar;

        // Generate size map
        this.sizeMap = new Int8Array(this.poolSize);
        this.totalSize = 0;
        for (let i = 0; i < this.poolSize; i++) {
            let size = this.rand.nextIntBetween(minKeySize, maxKeySize + 1);
            this.totalSize += size;
            this.sizeMap[i] = size;
        }
        this.pool = new Uint8Array(this.totalSize);
        for (let i = 0; i < this.totalSize; i++) {
            this.pool[i] = Math.floor(this.rand.next() * 256);
        }
    }

    getCharKey(charCode) {
        let keyIndex = Math.floor(Math.random() * this.nKeysPerChar);
        let sizeMapOffset = ((charCode - this.firstCharCode) * this.nKeysPerChar) + keyIndex;
        let keySize = this.sizeMap[sizeMapOffset];
        let keyOffset = 0;

        for (let i = 0; i < sizeMapOffset; i++) {
            keyOffset += this.sizeMap[i];
        }

        let key = "";
        for (let i = keyOffset; i < keyOffset + keySize; i++) {
            key += String.fromCharCode(this.pool[i]);
        }

        return key;
    }

    getChar(key) {
        const keyMap = new Uint8Array(key.split("").map(v => v.charCodeAt(0)));
        const keyMapSize = keyMap.length;
        let poolOffset = 0;
        const sizeMapSize = this.sizeMap.length;
        search: for (let sizeMapIndex = 0; sizeMapIndex < sizeMapSize; sizeMapIndex++) {
            if (this.sizeMap[sizeMapIndex] !== keyMapSize) {
                poolOffset += this.sizeMap[sizeMapIndex];
                continue search;
            }
            for (let i = 0; i < keyMapSize; i++) {
                if (this.pool[poolOffset + i] !== keyMap[i]) {
                    poolOffset += this.sizeMap[sizeMapIndex];
                    continue search;
                }
            }
            const char = Math.floor(sizeMapIndex / this.nKeysPerChar) + this.firstCharCode
            return char;
        }
        return null;
    }
}