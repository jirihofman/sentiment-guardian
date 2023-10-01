import { getSentimentCategoryByNumber } from '../util.js';

describe('test the_sentiment_of_the_guardian', function() {
    it('test the-sentiment-of-the-guardian.getSentimentCategoryByNumber', function() {
        expect(getSentimentCategoryByNumber(1)).toEqual('NEG1');
        expect(getSentimentCategoryByNumber(10)).toEqual('NEG1');
        expect(getSentimentCategoryByNumber(20)).toEqual('NEG2');
        expect(getSentimentCategoryByNumber(30)).toEqual('NEG2');
        expect(getSentimentCategoryByNumber(39)).toEqual('NEG2');
        expect(getSentimentCategoryByNumber(40)).toEqual('NEU');
        expect(getSentimentCategoryByNumber(50)).toEqual('NEU');
        expect(getSentimentCategoryByNumber(60)).toEqual('NEU');
        expect(getSentimentCategoryByNumber(61)).toEqual('POS1');
        expect(getSentimentCategoryByNumber(70)).toEqual('POS1');
        expect(getSentimentCategoryByNumber(80)).toEqual('POS1');
        expect(getSentimentCategoryByNumber(81)).toEqual('POS2');
        expect(getSentimentCategoryByNumber(100)).toEqual('POS2');
    });
});
