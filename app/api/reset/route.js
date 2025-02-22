/* eslint-disable no-console */
import { Redis } from '@upstash/redis';

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

import { timingSafeEqual } from 'crypto';

export async function POST(req) {
    const { adminApiKey } = await req.json();
    const expectedKey = process.env.ADMIN_API_KEY;
    
    if (!adminApiKey || !expectedKey || 
        !timingSafeEqual(Buffer.from(adminApiKey), Buffer.from(expectedKey))) {
        return new Response('Unauthorized', { status: 403 });
    }
}
    // flushall
    await redis.flushall();
    // TODO: Reset vercel cache by tag.

    return new Response('Redis flushed', { status: 200 });
}
