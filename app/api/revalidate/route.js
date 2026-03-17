/* eslint-disable no-console */
// import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req) {
    const { adminApiKey } = await req.json();

    if (adminApiKey !== process.env.ADMIN_API_KEY) {
        return new Response('Unauthorized', { status: 403 });
    }
    console.log('Revalidating Tags');
    revalidateTag('article:guardian');
    console.log('Revalidated article:guardian');
    revalidateTag('article:guardian:hits');
    console.log('Revalidated article:guardian:hits');
    revalidateTag('category:guardian');
    console.log('Revalidated category:guardian');
    revalidateTag('ai-comment-text-openai');

    // return NextResponse.json({ now: Date.now(), revalidated: true });
    return new Response(JSON.stringify({ now: Date.now(), revalidated: true }));
}
