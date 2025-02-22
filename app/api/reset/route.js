/* eslint-disable no-console */
import { Redis } from '@upstash/redis';

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

export async function GET(req) {
    const { adminApiKey } = await req.json();

    if (adminApiKey !== process.env.ADMIN_API_KEY) {
        return new Response('Unauthorized', { status: 403 });
    }
    // flushall
    await redis.flushall();
    // TODO: Reset vercel cache by tag.

    return new Response('Redis flushed', { status: 200 });
}
