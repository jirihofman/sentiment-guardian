import { getSentiment } from '../../util/util';
import { toInteger } from 'lodash';
import PropTypes from 'prop-types';

const CarouselSummary = async ({ articles, summary }) => {

    const averageSentiment = Math.round(articles
        .map(feature => toInteger(feature.sentiment))
        .reduce((a, b) => a + b, 0) / articles.length);

    const averageSentimentEmoji = getSentiment(averageSentiment);

    const cardBodyStyle = {
        maxHeight: '120px',
        minHeight: '120px',
        overflow: 'hidden',
    };

    return (
        <div className='mx-0 p-0'>
            <div className="row row-cols-1 row-cols-2 g-2 mb-0">
                <div className="col">
                    <div className="card h-100">
                        <div className="card-header">Average <span className='text-secondary' style={{ fontSize: '0.5em' }}>(out of 100)</span></div>
                        <div className="card-body text-center m-0 p-0" style={cardBodyStyle}>
                            <span style={{ fontSize: '2.5em' }}>{averageSentimentEmoji}</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100">
                        <div className="card-header">
                                Categories
                        </div>
                        <div className="card-body p-0 m-0 text-center" style={cardBodyStyle}>
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
async function SummaryCategories({ summary }) {

    const maxCount = Math.max((summary).map(category => category.count).reduce((a, b) => a + b, 0));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0">
                {summary.map((category, index) => {
                    return <div key={index} className="flex items-center w-32 sm:w-64">
                        <span className="w-6 mr-2">{category.emoji}</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div className={`h-full ${category.color}`}
                                style={{ width: `${(category.count / maxCount) * 100}%` }}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600 w-10">{category.count}</span>
                    </div>;
                }
                )}
            </div>
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
