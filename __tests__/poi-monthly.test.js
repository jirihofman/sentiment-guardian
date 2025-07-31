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

    it('should fetch and sort POI monthly data in ASCENDING order (oldest first)', async () => {
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
        
        // Should have all months
        expect(result).toHaveLength(4);
        
        // Check the order - should be ASCENDING (oldest first) - THIS IS THE EXPECTED FIX
        expect(result[0].yearMonth).toBe('2023-12');
        expect(result[1].yearMonth).toBe('2024-01');
        expect(result[2].yearMonth).toBe('2024-02');
        expect(result[3].yearMonth).toBe('2024-03');
        
        // Check persons data
        expect(result[0].persons).toEqual(['David Johnson', 'Eve Adams']);
        expect(result[1].persons).toEqual(['John Doe', 'Jane Smith']);
        expect(result[2].persons).toEqual(['Charlie Davis']);
        expect(result[3].persons).toEqual(['Alice Brown', 'Bob Wilson']);
    });

    it('should fill in missing months with empty data', async () => {
        // Simulate data with gaps (missing February)
        const mockDataWithGaps = [
            { key: 'ai-persons-of-interest-monthly:2024-01', result: '["John Doe"]' },
            { key: 'ai-persons-of-interest-monthly:2024-03', result: '["Alice Brown"]' },
            // Missing 2024-02
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
        
        // Should fill in the missing month - THIS IS THE EXPECTED FIX
        expect(result).toHaveLength(3);
        expect(result[0].yearMonth).toBe('2024-01');
        expect(result[0].persons).toEqual(['John Doe']);
        expect(result[1].yearMonth).toBe('2024-02'); // This should be filled in
        expect(result[1].persons).toEqual([]); // Empty array for missing month
        expect(result[2].yearMonth).toBe('2024-03');
        expect(result[2].persons).toEqual(['Alice Brown']);
    });
});