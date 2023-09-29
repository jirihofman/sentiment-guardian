import Link from 'next/link';
// import Image from 'next/image';
import range from 'lodash/range';
import { getArticlesKvGuardian0 } from '../../lib/data';
import { toInteger } from 'lodash';

const header = 'Latest Guardian headlines';

export const revalidate = 60;

const Feature = async () => {

    const articles = await getArticlesKvGuardian0();
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached articles', articles.length);

    const averageSentiment = articles
        .map(feature => toInteger(feature.sentiment))
        .reduce((a, b) => a + b, 0) / articles.length;

    const averageSentimentEmoji = getSentiment(averageSentiment);

    return (
        <div className='container px-4 py-0'>
            <h2 className="pb-2 border-bottom" id='features'>
                {header}
                <span className='float-end mx-3'>
                    {averageSentimentEmoji}
                </span>
            </h2>
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
                                    <span>
                                        {feature.title}
                                        <span className='float-end mx-3'>
                                            <Link href={feature.link} passHref>link</Link>
                                        </span>
                                    </span>
                                </td>
                                <td>
                                    <span>{feature.date.replace('T', ' ').replace('Z', '').replace(/:\d\d$/, '')}</span>
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
