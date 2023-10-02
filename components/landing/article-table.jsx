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
        getCategoriesSummaryKvGuardian(),
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
            <div className='mx-0 p-0'>
                <div className="row row-cols-1 row-cols-2 g-2 mb-2">
                    <div className="col">
                        <div className="card h-100">
                            <div className="card-header">Average <span className='text-secondary' style={{ fontSize: '0.5em' }}>(out of 100)</span></div>
                            <div className="card-body text-center m-0 p-0" style={{ height: '120px' }}>
                                <span style={{ fontSize: '2.5em' }}>{averageSentimentEmoji}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100">
                            <div className="card-header">
                                Categories
                            </div>
                            <div className="card-body p-0 m-0 text-center" style={{ height: '120px' }}>
                                <SummaryCategories summary={summary} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="pb-2 border-bottom">{header}</h2>
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
            <div className='mx-0 p-0'>
                <div className="row row-cols-1 row-cols-2 g-2 mb-2">
                    <div className="col">
                        <div className="card h-100">
                            <div className="card-header">Average <span className='text-secondary' style={{ fontSize: '0.5em' }}>(out of 100)</span></div>
                            <div className="card-body text-center" style={{ fontSize: '2.5em', height: '120px' }}>
                                <span>
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="sr-only" />
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100">
                            <div className="card-header">
                                Categories
                            </div>
                            <div className="card-body text-center" style={{ fontSize: '3em', height: '120px' }}>
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="sr-only" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

/** Shows five emojis with variable font-size based on their ratio. */
async function SummaryCategories({ summary }) {

    const total = Object.keys(summary).reduce((a, b) => a + summary[b], 0);

    return (
        <div style={{ marginLeft: '-5px' }}>
            {
                Object.keys(summary).filter(key => key !== 'total').map((key, index) => {

                    const value = summary[key] || 0;
                    if (!value) {
                        return null;
                    }
                    const ratio = value / total;
                    const fontSize = Math.max(1, ratio * 7).toFixed(2) + 'em';

                    return <span key={index} style={{ fontSize, marginLeft: '-5px' }} title={value}>{key}</span >;
                })
            }
        </div>
    );
}
