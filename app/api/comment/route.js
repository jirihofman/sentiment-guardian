/* eslint-disable no-console */
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

const openai = new OpenAI();

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

async function doAllTheShit() {
    await doAllTheCommentShit();
    // await doAllTheSpeechShit();
}

async function doAllTheCommentShit() {

    const articles = await redis.zrange('article:guardian', 0, -1, { count: 10, offset: 0, rev: true, withScores: false });
    const articleTitles = articles.map((article) => article.title).join('\n');
    const prompt = `
Shortly (about 100 words) summarize following article headlines. Try to identify a major issue and its area or location. Show only the comment. Don't comment on each article separatelly.

Article headlines:
${articleTitles}
`;

    const chatCompletion = await openai.chat.completions.create({
        max_tokens: 200,
        messages: [
            { content: 'Newspaper headlines commentator with a quick wit and prone to sarcasm.', role: 'system' },
            { content: prompt, role: 'user' }
        ],
        model: 'gpt-4-1106-preview',
        user: 'The sentiment of The Guardian',
    });
    console.log('comment text', chatCompletion.choices[0].message);
    let comment = chatCompletion.choices[0].message.content;
    // Split comment into separate lines
    if (comment.includes('\n')) {
        comment = comment.split('\n');
        // Remove last line
        comment.pop();
        // Join lines back
        comment = comment.join('\n');
    }

    // Save time when created as ai-comment-date-openai
    const date = new Date();
    const dateKey = 'ai-comment-date-openai';
    await redis.set(dateKey, date.toISOString());

    // Save comment as ai-comment-text-openai
    const commentKey = 'ai-comment-text-openai';
    await redis.set(commentKey, comment);

    return { comment, date };
}

export async function POST(req) {

    // read adminApiKey from request body.
    const { adminApiKey } = await req.json();
    if (adminApiKey === process.env.ADMIN_API_KEY) {
        const commentAdded = await doAllTheShit();
        return new Response(JSON.stringify(commentAdded, null, 4));
    } else {
        return new Response('Unauthorized to perform this action', { status: 403 });
    }
}
