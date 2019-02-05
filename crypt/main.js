"use strict";

const FIRST_CHAR = 32;
const LAST_CHAR = 256;
const MIN_KEY_SIZE = 3;
const MAX_KEY_SIZE = 7;
const KEYS_PER_CHAR = 100; // 100;


let cypherPool;

const dictBtnEl = document.getElementById("dict");
const srcEl = document.getElementById("src");
const dstEl = document.getElementById("dst");
const encryptBtnEl = document.getElementById("encrypt");
const decryptBtnEl = document.getElementById("decrypt");
const passEl = document.getElementById("pass");

dictBtnEl.addEventListener("click", e => {
    encryptBtnEl.setAttribute("disabled", "disabled");
    decryptBtnEl.setAttribute("disabled", "disabled");
    if (pass.value === "") {
        return;
    }
    dictBtnEl.setAttribute("disabled", "disabled");
    setTimeout(() => {
        cypherPool = new CypherPool(hashCode(pass.value), FIRST_CHAR, LAST_CHAR, KEYS_PER_CHAR, MIN_KEY_SIZE, MAX_KEY_SIZE);
        encryptBtnEl.removeAttribute("disabled");
        decryptBtnEl.removeAttribute("disabled");
        dictBtnEl.removeAttribute("disabled");
    }, 1);

});
encryptBtnEl.addEventListener("click", e => dstEl.value = enc(srcEl.value, cypherPool));
decryptBtnEl.addEventListener("click", e => srcEl.value = dec(dstEl.value, cypherPool));