"use strict";

if (!localStorage.getItem("prayCount")) {
    localStorage.setItem("prayCount", "0");
}

const prayButtonEl = document.getElementById("pray_button");

function updatePraysEl() {
    document.getElementById("prays").textContent = `${localStorage.getItem("prayCount")} 🤲`;
}

prayButtonEl.addEventListener("click", e => {
    localStorage.setItem("prayCount", BigInt(localStorage.getItem("prayCount")) + 1n);
    updatePraysEl();
}, false);

updatePraysEl();

