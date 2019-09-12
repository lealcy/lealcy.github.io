"use strict";


function wordHash(word) {
    let hash = 0n;
    let len = word.length;
    for (let i = 0; i < len; i++) {
        hash += BigInt(word.charCodeAt(i)) << (8n * BigInt(i));
    }
    return hash;
}

// Create hash dictionary
const wordHashTable = new Set;
wordList.split(" ").forEach(word => {
    wordHashTable.add(wordHash(word));
});




