// Determine sentiment range: NEG1, NEG2, NEU, POS1, POS2
// NEG1: the worst
// NEG2: bad
// NEU: neutral
// POS1: good
// POS2: the best
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
            result = 'NEG1';
        } else {
            result = 'NEG2';
        }
    }

    return result;
}
