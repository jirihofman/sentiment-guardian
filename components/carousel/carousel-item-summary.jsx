'use client';

import { getSentiment } from '../../util/util';
import { toInteger } from 'lodash';
import PropTypes from 'prop-types';

const CarouselSummary = ({ articles, summary }) => {

    const averageSentiment = Math.round(articles
        .map(feature => toInteger(feature.sentiment))
        .reduce((a, b) => a + b, 0) / articles.length);

    const averageSentimentEmoji = getSentiment(averageSentiment);

    return (
        <div className='p-3'>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h6 className="mb-0 fw-semibold">Average Sentiment</h6>
                            <small className="text-muted">Out of 100</small>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-center">
                                <div style={{ fontSize: '3.5rem', lineHeight: '1' }}>{averageSentimentEmoji}</div>
                                <div className="mt-2 fw-semibold text-muted">{averageSentiment}/100</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h6 className="mb-0 fw-semibold">Categories</h6>
                            <small className="text-muted">Sentiment distribution</small>
                        </div>
                        <div className="card-body" style={{ minHeight: '120px' }}>
                            <SummaryCategories summary={summary} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CarouselSummary.propTypes = {
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            sentiment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            // ...other article properties if needed...
        })
    ).isRequired,
    summary: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
            emoji: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default CarouselSummary;

/** Shows five emojis with variable font-size based on their ratio. */
function SummaryCategories({ summary }) {

    const maxCount = Math.max((summary).map(category => category.count).reduce((a, b) => a + b, 0));

    return (
        <div className="d-flex flex-column gap-2">
            {summary.map((category, index) => {
                const percentage = (category.count / maxCount) * 100;
                return (
                    <div key={index} className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.25rem', minWidth: '28px' }}>{category.emoji}</span>
                        <div className="flex-grow-1">
                            <div className="progress" style={{ height: '24px', borderRadius: '0.5rem' }}>
                                <div 
                                    className={`progress-bar ${category.color}`}
                                    role="progressbar"
                                    style={{ width: `${percentage}%` }}
                                    aria-valuenow={percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                        <span className="text-muted fw-semibold" style={{ minWidth: '32px', textAlign: 'right' }}>
                            {category.count}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

SummaryCategories.propTypes = {
    summary: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
            emoji: PropTypes.string.isRequired,
        })
    ).isRequired,
};
