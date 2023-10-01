/* eslint-disable no-console */
import { kv } from '@vercel/kv';
import { parse } from 'node-html-parser';
import xml2js from 'xml2js';

export const revalidate = 0;

async function doAllTheShit() {
    // Get Headlines from https://www.theguardian.com/international. Id = container-headlines
    const html = await fetch('https://www.theguardian.com/international', { next: { revalidate: 0 }}).then(res => res.text());
    // Parse the html and get the headlines from #container-headlines.
    const doc = parse(html);
    const headlines = [...doc.querySelectorAll('#container-headlines .show-underline')].map(headline => headline.innerText);
    const links = [...doc.querySelectorAll('#container-headlines a')].map(link => link.getAttribute('href'));
    console.log('links', links);
    console.log('headlines', headlines);

    // Add missing articles to KV without sentiment.
    // Supposed to run every hour or 10 minutes. Need RSS to get the date which is transformed into a score.
    const newspaper = 'guardian';
    const rss = await fetch('https://www.theguardian.com/international/rss', { next: { revalidate: 0 }}).then(res => res.text());
    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(rss);
    const titlesFromRss = parsed.rss.channel[0].item.map(item => item.title[0]);
    console.log('titlesFromRss', titlesFromRss);
    const articlesFromRss = parsed.rss.channel[0].item.map(item => ({
        category: [...item.category].map(category => category._),
        date: item['dc:date'][0],
        // Takes too much space in KV.
        // description: item.description[0],
        link: item.link[0],
        title: item.title[0],
    }))
        // Remove articles in Sport category.
        .filter(article => !article.category.includes('Sport'))
        // Remove articles not in HTML headlines. Compare end of the article.link with html link.
        .filter(article => links.find(link => article.link.endsWith(link)));

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

    await kv.set('articles-last-updated', new Date().toISOString());
    if (articlesAdded.length) {
        await kv.set('articles-last-added', new Date().toISOString());
    }

    return articlesAdded;
}

// Called from GitHub Actions with adminApiKey.
export async function POST(req) {

    // read adminApiKey from request body.
    const { adminApiKey } = await req.json();
    if (adminApiKey === process.env.ADMIN_API_KEY) {
        const articlesAdded = await doAllTheShit();
        return new Response(JSON.stringify(articlesAdded, null, 4));
    } else {
        console.log(process.env.ADMIN_API_KEY);
        return new Response('Unauthorized to perform this action', { status: 403 });
    }
}
