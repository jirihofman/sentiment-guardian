import React from 'react';
import Link from 'next/link';
import range from 'lodash/range';
import { getArticlesKvGuardian, getCategoriesSummaryKvGuardian, getCommentsKvGuardian, getPoiMonthlyKvGuardian } from '../../lib/data';
import { getSentiment } from '../../util/util';
import FrontPageCarousel from '../carousel/front-page-carousel';
import { MODEL_GPT_SENTIMENT } from '../../lib/const';
import Pagination from '../pagination';
import PropTypes from 'prop-types';

const header = 'Latest Guardian Headlines';

const ArticleTable = async ({ page = 1 }) => {
    const ITEMS_PER_PAGE = 20;
    const TOTAL_PAGES = 5;
    
    // Calculate offset for pagination
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // eslint-disable-next-line no-undef
    const [ articles, summary, comments, poiData ] = await Promise.all([
        getArticlesKvGuardian(offset, ITEMS_PER_PAGE),
        getCategoriesSummaryKvGuardian(),
        getCommentsKvGuardian(),
        getPoiMonthlyKvGuardian(),
    ]);
    const summaryWithCounts = Object.keys(summary).map(cat => ({
        color: getBgColorByEmoji(cat),
        count: summary[cat],
        emoji: cat,
    }));
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached articles', articles.length);
    // eslint-disable-next-line no-console
    console.log('Loaded %d cached categories', Object.keys(summary).length);

    return (
        <div className='container px-4 py-0 my-4'>
            <FrontPageCarousel articles={articles} summary={summaryWithCounts} comments={comments} poiData={poiData} model={MODEL_GPT_SENTIMENT} />
            
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="mb-0">{header}</h2>
                <span className="badge bg-primary">{articles.length} articles</span>
            </div>
            
            <div className="table-responsive">
                <table className="table">
                    <TableHeader />
                    <tbody>
                        {
                            articles.map((feature, key) => {

                                const date = <span className='text-muted small'>
                                    {feature.date.replace('T', ' ').replace('Z', '').replace(/:\d\d$/, '')}
                                </span>;

                                return <tr key={key}>
                                    <td className="text-center" style={{ fontSize: '1.75rem', width: '80px' }}>
                                        {getSentiment(feature.sentiment)}
                                    </td>
                                    <td>
                                        <Link href={feature.link} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                                            <div className="fw-semibold text-dark mb-1">{feature.title}</div>
                                            <div className="d-md-none">{date}</div>
                                        </Link>
                                    </td>
                                    <td className='d-none d-md-table-cell text-end' style={{ width: '180px' }}>
                                        {date}
                                    </td>
                                </tr>;
                            })
                        }
                    </tbody>
                </table>
            </div>
            
            <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
                    <use xlinkHref="#info-fill"/>
                </svg>
                <div className="small">
                    Articles are synced every 20 minutes. Evaluating sentiment is a slow process, so it may take a few minutes for the sentiment to appear.
                </div>
            </div>
            
            {/* Pagination */}
            <Pagination currentPage={page} totalPages={TOTAL_PAGES} />
        </div>
    );
};

export default ArticleTable;

// Add PropTypes validation
ArticleTable.propTypes = {
    page: PropTypes.number,
};

export async function ArticleTableSkeleton() {
    return (
        <div className='container px-4 py-0 my-4'>
            <FrontPageCarouselSkeleton />
            
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="mb-0">{header}</h2>
            </div>
            
            <div className="table-responsive">
                <table className="table">
                    <TableHeader />
                    <tbody>
                        {range(1, 11).map(key => (
                            <tr key={key}>
                                <td className="text-center">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="progress" style={{ height: '24px' }}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}></div>
                                    </div>
                                </td>
                                <td className='d-none d-md-table-cell text-end'>
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

async function TableHeader() {
    return (
        <thead>
            <tr>
                <th scope="col" className='text-center'>Sentiment</th>
                <th scope="col">Title</th>
                <th scope="col" className='d-none d-md-table-cell text-end'>Published</th>
            </tr>
        </thead>
    );
}

async function FrontPageCarouselSkeleton() {
    return (
        <div 
            className='mb-4 d-flex align-items-center justify-content-center bg-white' 
            style={{ 
                borderRadius: '0.75rem', 
                height: '200px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
        >
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

// Example
function getBgColorByEmoji(emoji) {
    switch (emoji) {
        case '😭':
            return 'bg-danger';
        case '😔':
            return 'bg-warning';
        case '😐':
            return 'bg-secondary';
        case '🙂':
            return 'bg-info';
        case '😀':
            return 'bg-success';
        default:
            return 'bg-secondary';
    }
}
