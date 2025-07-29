import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

// Using fetch to be able to use next.js revalidate.
const getArticlesKvGuardianByDate = async (start, end) => {

    // Only articles created in the given month.
    const body = JSON.stringify([
        ['ZRANGEBYSCORE', 'article:guardian', start, end]
    ]);
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
        body,
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        method: 'POST',
        next: {
            // 25 days
            revalidate: 60 * 60 * 24 * 25,
            tags: ['article:guardian', 'article:guardian:hits']
        },
    });

    const data = await res.json();
    const titles = data[0].result.map(article => JSON.parse(article)).map(article => article.title);

    return titles;
};

export async function GET() {
    try {
        // Check if Redis is configured
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get all POI data keys from Redis and retrieve the data
        const keys = await redis.keys('ai-persons-of-interest-monthly:*');
        
        if (!keys.length) {
            return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get all POI data
        const poiDataPromises = keys.map(async (key) => {
            const data = await redis.get(key);
            const yearMonth = key.replace('ai-persons-of-interest-monthly:', '');
            return {
                yearMonth,
                persons: JSON.parse(data),
            };
        });

        // eslint-disable-next-line no-undef
        const poiData = await Promise.all(poiDataPromises);
        
        // Sort by year-month descending (latest first)
        poiData.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));

        return new Response(JSON.stringify(poiData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching POI data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch POI data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req) {
    // Check if required environment variables are available
    if (!process.env.ADMIN_API_KEY || !process.env.OPENAI_API_KEY || !process.env.UPSTASH_REDIS_REST_URL) {
        return new Response('Service temporarily unavailable', { status: 503 });
    }

    // read adminApiKey from request body.
    const { adminApiKey } = await req.json();
    if (adminApiKey === process.env.ADMIN_API_KEY) {
        const commentAdded = await doAllTheShitForAMonth();
        return new Response(JSON.stringify(commentAdded, null, 4));
    } else {
        return new Response('Unauthorized to perform this action', { status: 403 });
    }
}

async function doAllTheShitForAMonth(year, month) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!year && !month) {
        // Run for current month.
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
	
        // Are there any data for this month?
        const key = `ai-persons-of-interest-monthly:${currentYear}-${currentMonth}`;
        const personsOfInterestMonthly = await redis.get(key);
        if (personsOfInterestMonthly) {
            return new Response('Already processed for this month');
        }

        year = currentYear;
        month = currentMonth;
    }

    const key = `ai-persons-of-interest-monthly:${year}-${month}`;
    const personsOfInterestMonthly = await redis.get(key);
    if (personsOfInterestMonthly) {
        return JSON.parse(personsOfInterestMonthly);
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    // Convert to "YYYYMMDD000000"
    const scoreStart = start.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '').replace(' ', '');
    const scoreEnd = end.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '').replace(' ', '');
    const articles = await getArticlesKvGuardianByDate(scoreStart, scoreEnd);
    if (!articles.length) {
        return 'No articles for: ' + start.toISOString() + ' - ' + end.toISOString();
    }

    // Feed the articles to OpenAI to get the main theme.
    const result = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'What are the persons The Guardian is most obsessed with?' },
            { role: 'system', content: 'Select 3 names. Delimiter: ","' },
            ...articles.map(article => ({ role: 'user', content: article })),
        ],
        user: 'The main persons of interest of The Guardian',
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'persons-of-interest',
                strict: true,
                description: 'The persons The Guardian is most obsessed with.',
                schema: {
                    type: 'object',
                    properties: {
                        final_answer: {
                            type: 'string',
                        },
                    },
                    required: ['final_answer'],
                    additionalProperties: false,
                }
            }
        }
    });
    const personsOfInterest = JSON.parse(result.choices[0].message.content).final_answer.split(',').map(person => person.trim());

    // Save the result to Redis.
    await redis.set(key, JSON.stringify(personsOfInterest));

    // Try again for previous month.
    const previousMonth = month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    return doAllTheShitForAMonth(previousYear, previousMonth);
}
