export function createFromTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true);
}