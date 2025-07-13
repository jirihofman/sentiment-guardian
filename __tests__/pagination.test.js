// Test pagination logic
const mockArticles = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Article ${i + 1}`,
    sentiment: 'NEU',
    date: new Date().toISOString(),
    link: `https://example.com/article-${i + 1}`,
}));

// Mock the fetch function to simulate Redis responses
global.fetch = jest.fn().mockImplementation((url, options) => {
    const body = JSON.parse(options.body);
    const offset = body[0][4] || 0;
    const limit = body[0][5] || 20;
    
    return Promise.resolve({
        json: () => Promise.resolve([
            { result: mockArticles.slice(offset, offset + limit).map(article => JSON.stringify(article)) },
            { result: 1 }
        ])
    });
});

describe('Pagination Logic', () => {
    beforeEach(() => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:6379';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test_token';
        jest.clearAllMocks();
    });

    it('should fetch first page with correct offset and limit', async () => {
        const { getArticlesKvGuardian } = require('../lib/data');
        const articles = await getArticlesKvGuardian(0, 20);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:6379/pipeline',
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"LIMIT", 0, 20'),
            })
        );
        
        expect(articles).toHaveLength(20);
        expect(articles[0].id).toBe(1);
    });

    it('should fetch second page with correct offset', async () => {
        const { getArticlesKvGuardian } = require('../lib/data');
        const articles = await getArticlesKvGuardian(20, 20);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:6379/pipeline',
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"LIMIT", 20, 20'),
            })
        );
        
        expect(articles).toHaveLength(20);
        expect(articles[0].id).toBe(21);
    });

    it('should fetch third page with correct offset', async () => {
        const { getArticlesKvGuardian } = require('../lib/data');
        const articles = await getArticlesKvGuardian(40, 20);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:6379/pipeline',
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"LIMIT", 40, 20'),
            })
        );
        
        expect(articles).toHaveLength(20);
        expect(articles[0].id).toBe(41);
    });
});