/* eslint-disable no-console */
import { Redis } from '@upstash/redis';

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

export async function GET() {

    // flushall
    await redis.flushall();
    // TODO: Reset vercel cache by tag.

    // Select latest 100 articles from Redis.
    return new Response('Redis flushed', { status: 200 });
}
