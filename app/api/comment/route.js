/* eslint-disable no-console */
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';
import { revalidateTag } from 'next/cache';

const openai = new OpenAI();

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

const commentKey = 'ai-comment-text-openai';
const audioKey = 'ai-comment-audio-openai';
const dateKey = 'ai-comment-date-openai';

async function doAllTheCommentShit() {

    const articles = await redis.zrange('article:guardian', 0, -1, { count: 10, offset: 0, rev: true, withScores: false });
    const articleTitles = articles.map((article) => article.title).join('\n');
    const prompt = `
Summarize article headlines. Try to identify a major issue or mood, and its area or location. Show only the comment that should be 1 to 5 sentences long. Don't comment on each article separatelly.

Articles:
${articleTitles}
`;

    const chatCompletion = await openai.chat.completions.create({
        frequency_penalty: 0,
        max_tokens: 96,
        messages: [
            { content: 'Newspaper headlines commentator with a quick wit and prone to sarcasm.', role: 'system' },
            // { content: 'Newspaper headlines commentator with a nihilistic view.', role: 'system' },
            { content: prompt, role: 'user' }
        ],
        model: 'gpt-3.5-turbo-1106', // cca 10x cheaper than gpt-4-1106-preview, not much a difference in the produced text
        presence_penalty: 0,
        temperature: 1,
        top_p: 1,
        user: 'The sentiment of The Guardian',
    });

    const comment = chatCompletion.choices[0].message.content;

    // Save time when created as ai-comment-date-openai
    const date = new Date();
    await redis.set(dateKey, date.toISOString());

    // Save comment as ai-comment-text-openai
    await redis.set(commentKey, comment);

    return { comment, date };
}

async function doAllTheSpeechShit() {

    console.log('Creating speech...');
    // Get the comment from redis.
    const comment = await redis.get(commentKey);
    console.log('Got comment', comment);
    // Get the date from redis.
    const dateKey = 'ai-comment-date-openai';
    const dateString = await redis.get(dateKey);
    const date = new Date(dateString);
    console.log('Got date', date);
    // Create speech of the comment.
    const speechCompletion = await openai.audio.speech.create({
        input: comment,
        model: 'tts-1-1106',
        voice: 'alloy',
    });
    console.log('Created speech', speechCompletion);
    // Filename is timestamp+model
    const filename = `${date.toISOString()}.mp3`;

    // Save the file to @vercel/blob.
    const file = await speechCompletion.arrayBuffer();
    console.log('Saving file...');
    const { url } = await put(filename, file, { access: 'public' });

    console.log('Saved file!', url);

    // Save the mp3 url to redis.
    await redis.set(audioKey, url);

    // Revoke next.js cache
    revalidateTag('ai-comment-text-openai');
    console.log('Revalidated ai-comment-text-openai');
    revalidateTag('ai-comment-date-openai');
    console.log('Revalidated ai-comment-date-openai');
    revalidateTag('ai-comment-audio-openai');
    console.log('Revalidated ai-comment-audio-openai');

    return { filename, url };
}

export async function POST(req) {

    // read adminApiKey from request body.
    const { adminApiKey, mode } = await req.json();
    if (adminApiKey === process.env.ADMIN_API_KEY) {
        if (mode === 'comment') {
            const commentAdded = await doAllTheCommentShit();
            return new Response(JSON.stringify(commentAdded, null, 4));
        } else if (mode === 'speech') {
            const commentAdded = await doAllTheSpeechShit();
            return new Response(JSON.stringify(commentAdded, null, 4));
        } else {
            return new Response('Unknown mode', { status: 400 });
        }
    } else {
        return new Response('Unauthorized to perform this action', { status: 403 });
    }
}
