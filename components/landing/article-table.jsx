import React from 'react'; // Add missing import
import Link from 'next/link';
import range from 'lodash/range';
import { getArticlesKvGuardian, getCategoriesSummaryKvGuardian } from '../../lib/data';
import { getSentiment } from '../../util/util';
import { Carousel } from 'react-bootstrap';
import CarouselSummary from '../carousel/carousel-item-summary';
import CarouselCommentary from '../carousel/carousel-item-commentary';
import PropTypes from 'prop-types';

const header = 'Latest Guardian headlines';

const carouselItemStyle = {
    maxHeight: '200px',
    overflow: 'hidden',
};

const FrontPageCarousel = ({ articles, summary }) => (

    <Carousel controls={true} indicators={false} variant='dark' style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} interval={null} className='mb-2'>
        <div className="carousel-item" style={carouselItemStyle}>
            <CarouselSummary articles={articles} summary={summary} />
            <div className="carousel-caption"></div>
        </div>
        <div className="carousel-item" style={carouselItemStyle}>
            <CarouselCommentary comment={'AI generated comment on today\'s events in text and speech. Comming soon ...'} model={'bar'} />
            <div className="carousel-caption"></div>
        </div>
    </Carousel>
);

FrontPageCarousel.propTypes = {
    articles: PropTypes.array.isRequired,
    summary: PropTypes.object.isRequired,
};

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

    return (
        <div className='container px-4 py-0 my-3'>
            <FrontPageCarousel articles={articles} summary={summary} />
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
        </div>
    );
};

export default ArticleTable;

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
        <Carousel style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', height: '113px' }} interval={null} className='mb-2'>
            <div className="carousel-item" key={1} style={{ ...carouselItemStyle, ...skeletonStyles }}>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="sr-only" />
                </div>
            </div>
        </Carousel>
    );
}
