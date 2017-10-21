export function createFromTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true);
}

export function shortNumber(value) {
    if (value >= 1000) {
        const suffixes = ["", "k", "m", "t", "g", "p", "y"];
        const suffixNum = (("" + value).length / 3) | 0;
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }
        let shortNum = 0;
        if (shortValue % 1 != 0) {
            shortNum = shortValue.toFixed(1);
        }
        return shortValue + suffixes[suffixNum];
    }
    return value;
}