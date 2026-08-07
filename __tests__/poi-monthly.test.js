import { getPoiMonthlyKvGuardian } from '../lib/data';

// Mock data to simulate Redis responses for POI monthly
const mockPoiData = [
    { key: 'ai-persons-of-interest-monthly:2024-01', result: '["John Doe", "Jane Smith"]' },
    { key: 'ai-persons-of-interest-monthly:2024-03', result: '["Alice Brown", "Bob Wilson"]' },
    { key: 'ai-persons-of-interest-monthly:2024-02', result: '["Charlie Davis"]' },
    { key: 'ai-persons-of-interest-monthly:2023-12', result: '["David Johnson", "Eve Adams"]' },
];

describe('POI Monthly Data', () => {
    beforeEach(() => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:6379';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test_token';
    });

    afterEach(() => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });

    it('should return empty array when Redis is not configured', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
        
        const result = await getPoiMonthlyKvGuardian();
        expect(result).toEqual([]);
    });

    it('should return empty array when no keys found', async () => {
        global.fetch = () => Promise.resolve({
            json: () => Promise.resolve([{ result: [] }])
        });

        const result = await getPoiMonthlyKvGuardian();
        expect(result).toEqual([]);
    });

    it('should fetch and sort POI monthly data in DESCENDING order (latest first)', async () => {
        const keys = mockPoiData.map(item => item.key);
        const getResults = mockPoiData.map(item => ({ result: item.result }));

        let callCount = 0;
        global.fetch = () => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    json: () => Promise.resolve([{ result: keys }])
                });
            } else {
                return Promise.resolve({
                    json: () => Promise.resolve(getResults)
                });
            }
        };

        const result = await getPoiMonthlyKvGuardian();
        
        // Should have all months that exist in data
        expect(result).toHaveLength(4);
        
        // Check the order - should be DESCENDING (latest first)
        expect(result[0].yearMonth).toBe('2024-03');
        expect(result[1].yearMonth).toBe('2024-02');
        expect(result[2].yearMonth).toBe('2024-01');
        expect(result[3].yearMonth).toBe('2023-12');
        
        // Check persons data
        expect(result[0].persons).toEqual(['Alice Brown', 'Bob Wilson']);
        expect(result[1].persons).toEqual(['Charlie Davis']);
        expect(result[2].persons).toEqual(['John Doe', 'Jane Smith']);
        expect(result[3].persons).toEqual(['David Johnson', 'Eve Adams']);
    });

    it('should only return months that have data (no gap filling)', async () => {
        // Simulate data with gaps (missing February)
        const mockDataWithGaps = [
            { key: 'ai-persons-of-interest-monthly:2024-01', result: '["John Doe"]' },
            { key: 'ai-persons-of-interest-monthly:2024-03', result: '["Alice Brown"]' },
            // Missing 2024-02 - should not be filled in
        ];
        
        const keys = mockDataWithGaps.map(item => item.key);
        const getResults = mockDataWithGaps.map(item => ({ result: item.result }));

        let callCount = 0;
        global.fetch = () => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    json: () => Promise.resolve([{ result: keys }])
                });
            } else {
                return Promise.resolve({
                    json: () => Promise.resolve(getResults)
                });
            }
        };

        const result = await getPoiMonthlyKvGuardian();
        
        // Should only have the months with actual data (no gap filling)
        expect(result).toHaveLength(2);
        expect(result[0].yearMonth).toBe('2024-03'); // Latest first
        expect(result[0].persons).toEqual(['Alice Brown']);
        expect(result[1].yearMonth).toBe('2024-01'); // Older second
        expect(result[1].persons).toEqual(['John Doe']);
        // 2024-02 should NOT be present
    });
});