"use strict";

function enc(text, pass) {
    const hashPass = hashCode(pass);
    const rand = new SeededRandom(hashPass);
    const dict = generateSubstitutionDictionary(rand);
    let cypher = "";
    for (let i = 0; i < text.length; i++) {
        const dec = text.charCodeAt(i);
        console.log(dec);
        cypher += dict[dec][Math.floor(Math.random() * dict[dec].length)];
    }
    return cypher;
}

function dec(cypher, pass) {
    const hashPass = hashCode(pass);
    const rand = new SeededRandom(hashPass);
    const dict = generateSubstitutionDictionary(rand);
    dict.forEach((arr, i) => {
        arr.forEach(v => {
            cypher = cypher.replace(v, String.fromCharCode(i));
        });
    });
    return cypher;
}


function generateSubstitutionDictionary(rand) {
    const map = [];
    for (let i = 32; i < 256; i++) {
        map[i] = [];
        for (let j = 0; j < 100; j++) {
            map[i].push(fingerprint(rand));
        }
    }
    return map;
}

function fingerprint(rand) {
    const pool = "1234567890-=!@#$%&*()_+qwertyuiop´[asdfghjklç~]zxcvbnm,.;/QWERTYUIOP`{ASDFGHJKLÇ^}|ZXCVBNM<>:?";
    const len = Math.round(rand.next() * 6 + 3);
    let fp = "";
    for (let i = 0; i < len; i++) {
        fp += pool[Math.floor(rand.next() * pool.length)];
    }
    return fp;
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


function randMinMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

class SeededRandom {
    constructor(seed = Math.random()) {
        this.seed = seed;
    }
    next() {
        this.seed = Math.sin(this.seed) * 10000;
        return this.seed - Math.floor(this.seed);

    }
}