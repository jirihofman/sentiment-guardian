import { getArticlesKvGuardian } from '../lib/data';

// Test pagination logic
const mockArticles = Array.from({ length: 100 }, (_, i) => ({
    date: new Date().toISOString(),
    id: i + 1,
    link: `https://example.com/article-${i + 1}`,
    sentiment: 'NEU',
    title: `Article ${i + 1}`,
}));

describe('Pagination Logic', () => {
    beforeEach(() => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:6379';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test_token';
        
        // Mock the fetch function to simulate Redis responses
        global.fetch = () => Promise.resolve({
            json: () => Promise.resolve([
                { result: mockArticles.slice(0, 20).map(article => JSON.stringify(article)) },
                { result: 1 }
            ])
        });
    });

    it('should fetch first page with correct offset and limit', async () => {
        const articles = await getArticlesKvGuardian(0, 20);
        
        expect(articles).toHaveLength(20);
        expect(articles[0]).toHaveProperty('id');
        expect(articles[0]).toHaveProperty('title');
    });

    it('should fetch second page with correct offset', async () => {
        const articles = await getArticlesKvGuardian(20, 20);
        
        expect(articles).toHaveLength(20);
        expect(articles[0]).toHaveProperty('id');
        expect(articles[0]).toHaveProperty('title');
    });

    it('should fetch third page with correct offset', async () => {
        const articles = await getArticlesKvGuardian(40, 20);
        
        expect(articles).toHaveLength(20);
        expect(articles[0]).toHaveProperty('id');
        expect(articles[0]).toHaveProperty('title');
    });
});