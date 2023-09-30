/* eslint-disable no-console */
import OpenAI from 'openai';
import { kv } from '@vercel/kv';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import pjson from '../../../package.json';

const openai = new OpenAI();

export const revalidate = 0;

async function doAllTheShit() {
    const articles = await kv.zrange('article:guardian', 0, -1, { count: 100, offset: 0, rev: true, withScores: false });
    const articlesWithoutSentiment = articles.filter(article => !article.sentiment);
    const max = 2;
    let processed = 0;

    console.log('articlesWithoutSentiment', articlesWithoutSentiment);
    for (const article of articlesWithoutSentiment) {
        if (processed >= max) {
            console.log('processed', processed, 'max', max);
            break;
        }
        // Get sentiment from OpenAI for this article.
        const message = `Determine sentiment of the following headline as a number from range 1-100. 100 is the most positive. Return only the number. Title: ${article.title}`;
        //  Article text is: ${article.description}
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ content: message, role: 'user' }],
            model: 'gpt-4',
            user: 'The sentiment of The Guardian'
        });
        console.log('chatCompletion for article', article.title, chatCompletion.choices);
        const sentiment = chatCompletion.choices[0].message.content;
        console.log('sentiment', sentiment);

        // Delete the article from KV.
        const deleted = await kv.zrem('article:guardian', JSON.stringify(article));
        console.log('deleted', deleted);
        // Add the article back to KV with sentiment.
        const score = article.date.replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '').replace(' ', '');
        console.log('score', score);
        const updated = await kv.zadd('article:guardian', {
            member: JSON.stringify({
                ...article,
                sentiment: sentiment
            }),
            score: score,
        });
        console.log('updated', updated);
        processed++;
    }

    return processed;
}

export async function GET(req) {

    const { userId } = getAuth(req);
    const user = userId ? await clerkClient.users.getUser(userId) : null;

    if (!user || user.emailAddresses[0].emailAddress !== pjson.author.email) {
        return new Response('Unauthorized to perform this action', { status: 403 });
    }

    const sentimentAdded = await doAllTheShit();

    return new Response(sentimentAdded);
}

export async function POST(req) {

    // read adminApiKey from request body.
    const { adminApiKey } = await req.json();
    if (adminApiKey === process.env.ADMIN_API_KEY) {
        const sentimentAdded = await doAllTheShit();
        return new Response(JSON.stringify(sentimentAdded, null, 4));
    } else {
        console.log(process.env.ADMIN_API_KEY);
        return new Response('Unauthorized to perform this action', { status: 403 });
    }

}
