import { Redis } from '@upstash/redis';
import { timingSafeEqual } from 'crypto';

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

interface RequestBody {
    adminApiKey: string;
}

export async function POST(req: Request) {
    const { adminApiKey } = await req.json() as RequestBody;
    const expectedKey = process.env.ADMIN_API_KEY;
    
    if (!adminApiKey || !expectedKey || 
        !timingSafeEqual(Buffer.from(adminApiKey), Buffer.from(expectedKey))) {
        return new Response('Unauthorized', { status: 403 });
    }

    // flushall
    await redis.flushall();
    // TODO: Reset vercel cache by tag.

    return new Response('Redis flushed', { status: 200 });
}
