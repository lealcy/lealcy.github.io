const messageEl = document.getElementById("message");
let fadeOut = null;

export function message(msg) {
    messageEl.className = "";
    messageEl.innerHTML = msg;
    setTimeout(e => messageEl.className = "messageAnimation", 10);
    clearTimeout(fadeOut);
    fadeOut = setTimeout(e => {
        messageEl.className = "";
        setTimeout(e => messageEl.className = "messageFadeOut", 10);
    }, 10000);
}