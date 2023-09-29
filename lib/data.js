import { cache } from 'react';
import { kv } from '@vercel/kv';
import { unstable_cache } from 'next/cache';

const revalidate = 60;

// TODO: Deprecate and find some other way to get articles from KV and cached in Vercel. See unstable_cache below - not working now.
// This might soon hit the limit of @vercel/kv hits per month.
export const getArticlesKvGuardian0 = async () => {
    return await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });
};

export const getArticlesKvGuardian = cache(async () => {
    // eslint-disable-next-line no-console
    console.log('Fetching articles from KV 1');
    const articles = await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });
    return articles;
}, revalidate);

export async function getArticlesKvGuardian2() {
    const cachedData = await unstable_cache(
        async () => {
            // eslint-disable-next-line no-console
            console.log('Fetching articles from KV 2');
            const articles = await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });
            return articles;
        }
    )();

    return cachedData;
}
