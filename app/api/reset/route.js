/* eslint-disable no-console */
import { kv } from '@vercel/kv';

export const revalidate = 0;

export async function GET() {

    // flushall
    await kv.flushall();
    
    // Select latest 100 articles from KV.
    return new Response('KV flushed', { status: 200 });
}
