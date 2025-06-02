/* eslint-disable no-console */
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';
import { getSentimentCategoryByNumber } from '../../../util/util';
import { MODEL_GPT_SENTIMENT } from '../../../lib/const';

const openai = new OpenAI();

export const revalidate = 0;

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

async function doAllTheShit() {
    const articles = await redis.zrange('article:guardian', 0, -1, { count: 100, offset: 0, rev: true, withScores: false });
    const articlesWithoutSentiment = articles.filter(article => !article.sentiment);
    const max = 4;
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
            model: MODEL_GPT_SENTIMENT,
            user: 'The Sentiment of The Guardian'
        });
        console.log('chatCompletion for article', article.title, chatCompletion.choices);
        const sentiment = chatCompletion.choices[0].message.content;
        console.log('sentiment', sentiment);

        // Delete the article from Redis.
        const deleted = await redis.zrem('article:guardian', JSON.stringify(article));
        console.log('deleted', deleted);
        // Add the article back to Redis with sentiment.
        const score = article.date.replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '').replace(' ', '');
        console.log('score', score);
        const updated = await redis.zadd('article:guardian', {
            member: JSON.stringify({
                ...article,
                sentiment
            }),
            score: score,
        });
        console.log('updated', updated);
        const sentimentCategory = getSentimentCategoryByNumber(sentiment);
        console.log('sentimentCategory', sentimentCategory);
        // Add the article to the sentiment category.
        await redis.incr('category:guardian:' + sentimentCategory);
        processed++;
    }

    return processed;
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
