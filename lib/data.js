import { cache } from 'react';
import { kv } from '@vercel/kv';

const revalidate = 60;

export const getArticlesKvGuardian = cache(async () => {
    // eslint-disable-next-line no-console
    console.log('Fetching articles from KV');
    const articles = await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });
    return articles;
}, revalidate);
