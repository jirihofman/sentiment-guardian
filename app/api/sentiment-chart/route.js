import { Redis } from '@upstash/redis';

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

export async function GET() {
    try {
        // Get all articles with sentiment from Redis
        const articles = await redis.zrange('article:guardian', 0, -1, { rev: true, withScores: false });
        
        // Filter articles that have sentiment data and process them
        const articlesWithSentiment = articles
            .filter(article => article.sentiment && article.sentiment !== undefined)
            .map(article => ({
                date: new Date(article.date).toISOString().split('T')[0], // Extract date only (YYYY-MM-DD)
                sentiment: parseInt(article.sentiment, 10)
            }))
            .filter(article => !isNaN(article.sentiment)); // Remove invalid sentiment values

        // Group articles by date and calculate average sentiment per day
        const sentimentByDate = articlesWithSentiment.reduce((acc, article) => {
            if (!acc[article.date]) {
                acc[article.date] = { count: 0, total: 0 };
            }
            acc[article.date].total += article.sentiment;
            acc[article.date].count += 1;
            return acc;
        }, {});

        // Calculate average sentiment per day and format for chart
        const chartData = Object.entries(sentimentByDate)
            .map(([date, data]) => ({
                date,
                sentiment: Math.round(data.total / data.count)
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

        return new Response(JSON.stringify(chartData), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching sentiment chart data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch sentiment data' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}