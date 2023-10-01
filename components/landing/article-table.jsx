import Link from 'next/link';
// import Image from 'next/image';
import range from 'lodash/range';
import { getArticlesKvGuardian, getCategoriesSummaryKvGuardian } from '../../lib/data';
import { toInteger } from 'lodash';

const header = 'Latest Guardian headlines';

export const revalidate = 60;

const ArticleTable = async () => {

    // eslint-disable-next-line no-undef
    const [ articles, summary ] = await Promise.all([
        getArticlesKvGuardian(),
        getCategoriesSummaryKvGuardian()
    ]);
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached articles', articles.length);
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached categories', Object.keys(summary).length);

    const averageSentiment = articles
        .map(feature => toInteger(feature.sentiment))
        .reduce((a, b) => a + b, 0) / articles.length;

    const averageSentimentEmoji = getSentiment(averageSentiment);

    return (
        <div className='container px-4 py-0 my-3'>
            <h2 className="pb-2 border-bottom" id='features'>
                {header}
            </h2>
            <div className='mx-1 p-1'>
                Average sentiment for the last {articles.length} headlines: {averageSentimentEmoji}
                {JSON.stringify(summary, null, 2)}
            </div>
            <table className="table">
                <TableHeader />
                <tbody>
                    {
                        articles.map((feature, key) => {

                            const date = <span style={{ fontSize: '0.8em' }} className=''>
                                <Link href={feature.link} passHref>{feature.date.replace('T', ' ').replace('Z', '').replace(/:\d\d$/, '')}</Link>
                            </span>;

                            return <tr key={key}>
                                <td>
                                    <span style={{ fontSize: '1.5em' }}>{getSentiment(feature.sentiment)}</span>
                                </td>
                                <td>
                                    <div>{feature.title}</div>
                                    <div className="d-inline d-sm-none">{date}</div>
                                </td>
                                <td className='d-none d-md-table-cell'>
                                    {date}
                                </td>
                            </tr>;
                        })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='3'>
                            <span className='text'>Articles are synced every 10 minutes. Evaluating sentiment is a slow process, so it may take a few minutes for the sentiment to appear.</span>
                        </td>
                    </tr>
                </tfoot>
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

export default ArticleTable;

export async function ArticleTableSkeleton() {
    return (
        <div className='container px-4 py-0 my-3'>
            <h2 className="pb-2 border-bottom" id='features'>{header}</h2>
            <div className='mx-1 p-1'>
                Average sentiment is loading...
            </div>
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
                            <td className='d-none d-md-table-cell'>
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
                <th scope="col" className='col-2 d-none d-md-table-cell'>Published</th>
            </tr>
        </thead>
    );
}
