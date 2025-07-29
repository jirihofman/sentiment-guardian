import React from 'react';
import Link from 'next/link';
import range from 'lodash/range';
import { getArticlesKvGuardian, getCategoriesSummaryKvGuardian, getCommentsKvGuardian, getPoiMonthlyKvGuardian } from '../../lib/data';
import { getSentiment } from '../../util/util';
import { Carousel } from 'react-bootstrap';
import CarouselSummary from '../carousel/carousel-item-summary';
import CarouselCommentary from '../carousel/carousel-item-commentary';
import CarouselPoi from '../carousel/carousel-item-poi';
import { MODEL_GPT_SENTIMENT } from '../../lib/const';
import Pagination from '../pagination';
import PropTypes from 'prop-types';

const header = 'Latest Guardian headlines';

const carouselItemStyle = {
    maxHeight: '200px',
    overflow: 'hidden',
};

const FrontPageCarousel = ({ articles, comments, summary, poiData }) => (

    <Carousel controls={true} indicators={false} variant='dark' style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} interval={null} className='mb-2'>
        <div className="carousel-item" style={carouselItemStyle}>
            <CarouselSummary articles={articles} summary={summary} />
        </div>
        <div className="carousel-item" style={carouselItemStyle}>
            <CarouselCommentary comments={comments} model={MODEL_GPT_SENTIMENT} />
        </div>
        <div className="carousel-item" style={carouselItemStyle}>
            <CarouselPoi poiData={poiData} />
        </div>
    </Carousel>
);

FrontPageCarousel.propTypes = {
    articles: PropTypes.array.isRequired,
    comments: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired,
    poiData: PropTypes.array,
};

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
        <div className='container px-4 py-0 my-3'>
            <FrontPageCarousel articles={articles} summary={summaryWithCounts} comments={comments} poiData={poiData} />
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
                            <span className='text'>Articles are synced every 20 minutes. Evaluating sentiment is a slow process, so it may take a few minutes for the sentiment to appear.</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
            
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
        <div className='container px-4 py-0 my-3'>
            <FrontPageCarouselSkeleton />
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

async function FrontPageCarouselSkeleton() {

    const skeletonStyles = {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    return (
        <Carousel style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', height: '159px' }} interval={null} className='mb-2'>
            <div className="carousel-item" key={1} style={{ ...carouselItemStyle, ...skeletonStyles }}>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="sr-only" />
                </div>
            </div>
        </Carousel>
    );
}

// Example
function getBgColorByEmoji(emoji) {
    switch (emoji) {
        case '😭':
            return 'bg-red-500';
        case '😔':
            return 'bg-orange-500';
        case '😐':
            return 'bg-yellow-500';
        case '🙂':
            return 'bg-lime-500';
        case '😀':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
}
