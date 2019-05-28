"use strict";

const inputEl = document.getElementById("input");
const resultEl = document.getElementById("result");
let lastSearch = "";
let permutations = [];

function permutate(letters) {
    const len = letters.length;
    const result = [letters.slice()];
    const c = new Array(len).fill(0);
    let i = 1, k, p;
    while (i < len) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = letters[i];
            letters[i] = letters[k];
            letters[k] = p;
            ++c[i];
            i = 1;
            result.push(letters.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function find(min = 1, max = 16) {
    if (!(lastSearch === inputEl.value)) {
        lastSearch = inputEl.value;
        permutations = permutate(inputEl.value.split(""));
    }
    const result = [];
    permutations.forEach(v => {
        const pword = v.join("");
        const len = pword.length;
        for (let i = min - 1; i < len; i++) {
            const w = pword.substring(0, i + 1);
             if (!result.includes(w) && wordHashTable.has(wordHash(w))) {
                result.push(w);
            }
        }
    });
    resultEl.innerHTML = result.sort().join("<br>");
}
