// import Link from 'next/link';
// import Image from 'next/image';
import xml2js from 'xml2js';
import range from 'lodash/range';

const Feature = async () => {

    // TODO: Load them from the database instead. The sentiment should be calculated there already.
    const rss = await fetch('https://www.theguardian.com/international/rss').then(res => res.text());
    // await new Promise(r => setTimeout(r, 1100));
    // process the xml in nodejs runtime
    const result = await xml2js.parseStringPromise(rss /*, options */);
    const items = result.rss.channel[0].item;
    const articles = [];
    items.forEach(item => {
        const article = {
            creator: item['dc:creator'][0],
            // Format: YYYY-MM-DD HH:MM
            date: item['dc:date'][0].split('T').join(' ').split(':').slice(0, 2).join(':'),
            desc: item.description[0],
            link: item.link[0],
            // For now it is a random number between 0 and 1 to simulate the sentiment.
            // Converted to a percentage later with no decimal places.
            sentiment: Math.floor(Math.random() * 100),
            title: item.title[0],
        };
        articles.push(article);
    });

    return (
        <div className='container px-4 py-0'>
            <h2 className="pb-2 border-bottom" id='features'>Latest news</h2>
            <table className="table">
                <TableHeader />
                <tbody>
                    {
                        articles.map((feature, key) => (
                            <tr key={key}>
                                <td>
                                    <span>{feature.sentiment}</span>
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

export default Feature;

export async function ArticleTableSkeleton() {
    return (
        <div className='container px-4 py-0'>
            <h2 className="pb-2 border-bottom" id='features'>Latest news</h2>
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
