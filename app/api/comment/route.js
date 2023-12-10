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
Summarize article headlines. Try to identify a major issue and its area or location. Show only the comment that should be 1 to 5 sentences long. Don't comment on each article separatelly.

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
