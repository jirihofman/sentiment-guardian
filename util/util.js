// Taken from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export const niceBytes = (a) => { let b = 0, c = parseInt(a, 10) || 0; for (; 1024 <= c && ++b;)c /= 1024; return c.toFixed(10 > c && 0 < b ? 1 : 0) + ' ' + ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][b]; };

// Determine sentiment range: NEG1, NEG2, NEU, POS1, POS2
export function getSentimentCategoryByNumber(sentiment) {
    let result = 'NEU';

    if (sentiment > 60) {
        if (sentiment > 80) {
            result = 'POS2';
        } else {
            result = 'POS1';
        }
    }

    if (sentiment < 40) {
        if (sentiment < 20) {
            result = 'NEG2';
        } else {
            result = 'NEG1';
        }
    }

    return result;
}
