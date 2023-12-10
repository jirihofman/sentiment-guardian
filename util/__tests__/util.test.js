import { getSentimentCategoryByNumber, getSentiment } from '../util.js';

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

    it('test the-sentiment-of-the-guardian.getSentiment', function() {
        expect(getSentiment(0)).toEqual('🤷');
        expect(getSentiment(10)).toEqual('😭 10');
        expect(getSentiment(20)).toEqual('😔 20');
        expect(getSentiment(30)).toEqual('😔 30');
        expect(getSentiment(39)).toEqual('😔 39');
        expect(getSentiment(40)).toEqual('😐 40');
        expect(getSentiment(50)).toEqual('😐 50');
        expect(getSentiment(60)).toEqual('😐 60');
        expect(getSentiment(61)).toEqual('🙂 61');
        expect(getSentiment(70)).toEqual('🙂 70');
        expect(getSentiment(80)).toEqual('🙂 80');
        expect(getSentiment(81)).toEqual('😁 81');
        expect(getSentiment(100)).toEqual('😁 100');
        expect(getSentiment()).toEqual('🤷');
    });
});
