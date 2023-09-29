// import Link from 'next/link';
// import Image from 'next/image';
import range from 'lodash/range';
import { kv } from '@vercel/kv';
import { cache } from 'react';

const header = 'Latest Guardian news';

const Feature = async () => {

    const cachedArticles = cache(
        async () => {
            // eslint-disable-next-line no-console
            console.log('Loading articles');
            const articles = await kv.zrange('article:guardian', 0, -1, { count: 20, offset: 0, rev: true, withScores: false });
            return articles;
        }, 60);
        
    const articles = await cachedArticles();
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached articles', articles.length);

    return (
        <div className='container px-4 py-0'>
            <h2 className="pb-2 border-bottom" id='features'>{header}</h2>
            <table className="table">
                <TableHeader />
                <tbody>
                    {
                        articles.map((feature, key) => (
                            <tr key={key}>
                                <td>
                                    <span>{getSentiment(feature.sentiment)}</span>
                                </td>
                                <td>
                                    <span>{feature.title}</span>
                                </td>
                                <td>
                                    <span>{feature.date}</span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

function getSentiment(sentiment) {

    let result = '😐';
    if (!sentiment) {
        return '🤷';
    }

    if (sentiment > 60) {
        if (sentiment > 80) {
            result = '😁';
        } else {
            result = '🙂';
        }
    }

    if (sentiment < 40) {
        if (sentiment < 20) {
            result = '😭';
        } else {
            result = '😔';
        }
    }

    return result + ' ' + (sentiment || '');
}

export default Feature;

export async function ArticleTableSkeleton() {
    return (
        <div className='container px-4 py-0'>
            <h2 className="pb-2 border-bottom" id='features'>{header}</h2>
            <table className="table">
                <TableHeader />
                <tbody>
                    {range(1, 11).map(key => (
                        <tr key={key}>
                            <td>
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="sr-only" />
                                </div>
                            </td>
                            <td>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}></div>
                                </div>
                            </td>
                            <td>
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="sr-only" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

async function TableHeader() {
    return (
        <thead>
            <tr>
                <th scope="col" className='col-1'>Sentiment</th>
                <th scope="col" className='col-9'>Title</th>
                <th scope="col" className='col-2'>Published</th>
            </tr>
        </thead>
    );
}
