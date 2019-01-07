"use strict";

const srcEl = document.getElementById("src");
const dstEl = document.getElementById("dst");
const encryptBtnEl = document.getElementById("encrypt");
const decryptBtnEl = document.getElementById("decrypt");
const passEl = document.getElementById("pass");

encryptBtnEl.addEventListener("click", e => dstEl.value = enc(srcEl.value, pass.value));
decryptBtnEl.addEventListener("click", e => srcEl.value = dec(dstEl.value, pass.value));