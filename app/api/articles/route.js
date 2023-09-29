/* eslint-disable no-console */
// import OpenAI from 'openai';
import { kv } from '@vercel/kv';
import xml2js from 'xml2js';

// const openai = new OpenAI();

export async function GET() {

    // Add missing articles to KV without sentiment.
    // Supposed to run every hour.
    const newspaper = 'guardian';
    const rss = await fetch('https://www.theguardian.com/international/rss', { next: { revalidate: 60 }}).then(res => res.text());
    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(rss);
    const articlesFromRss = parsed.rss.channel[0].item.map(item => ({
        category: [...item.category].map(category => category._),
        date: item['dc:date'][0],
        description: item.description[0],
        link: item.link[0],
        title: item.title[0],
    }))
    // Remove articles in Sport category.
        .filter(article => !article.category.includes('Sport'));

    console.log('articlesFromRss', articlesFromRss);
    const articlesKv = await kv.zrange('article:' + newspaper, 0, -1, { count: 100, offset: 0, rev: true, withScores: false });
    console.log('articlesKv', articlesKv);
    const articlesAdded = [];
    // Add missing articles to KV.
    for (const articleFromRss of articlesFromRss) {
        const found = articlesKv.find(articleKv => articleKv.link === articleFromRss.link);
        if (!found) {
            console.log('adding article to KV', articleFromRss);
            const score = articleFromRss.date.replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '').replace(' ', '');
            console.log('score', score);
            const added = await kv.zadd('article:' + newspaper, {
                member: JSON.stringify(articleFromRss),
                score: score,
            });
            console.log('added', added);
            articlesAdded.push(articleFromRss);
        }
    }

    // Select latest 100 articles from KV.
    return new Response(JSON.stringify(articlesAdded, null, 4));
}

// export async function POST(request) {

// 	// Get articles from KV without sentiment.
// 	const articles = await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });

// // const rss = await fetch('https://www.theguardian.com/international/rss', { next: { revalidate: 60 }}).then(res => res.text());
