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
    articles: PropTypes.array.isRequired,
    summary: PropTypes.object.isRequired,
};

export default CarouselSummary;

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

SummaryCategories.propTypes = {
    summary: PropTypes.object.isRequired,
};
