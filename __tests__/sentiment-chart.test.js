import { GET } from '../app/api/sentiment-chart/route.js';

// Simple test to verify the API route structure
describe('/api/sentiment-chart', () => {
    it('should have GET export', () => {
        expect(typeof GET).toBe('function');
    });
});