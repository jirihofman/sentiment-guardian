import PropTypes from 'prop-types';

const CarouselPoi = ({ poiData }) => {
    const cardBodyStyle = {
        maxHeight: '120px',
        minHeight: '120px',
        overflow: 'hidden',
    };

    // Get the most recent month's data
    const latestPoi = poiData && poiData.length > 0 ? poiData[0] : null;

    if (!latestPoi) {
        return (
            <div className='mx-0 p-0'>
                <div className="row row-cols-1 row-cols-1 g-2 mb-0">
                    <div className="col">
                        <div className="card h-100">
                            <div className="card-header">Person of Interest</div>
                            <div className="card-body text-center" style={cardBodyStyle}>
                                <p className="text-muted">No data available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [year, month] = latestPoi.yearMonth.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    return (
        <div className='mx-0 p-0'>
            <div className="row row-cols-1 row-cols-1 g-2 mb-0">
                <div className="col">
                    <div className="card h-100">
                        <div className="card-header">
                            Person of Interest - {monthName} {year}
                        </div>
                        <div className="card-body" style={cardBodyStyle}>
                            <div className="text-center">
                                {latestPoi.persons.map((person, index) => (
                                    <span key={index} className="badge bg-primary me-2 mb-2">
                                        {person}
                                    </span>
                                ))}
                            </div>
                            <p className="small text-muted mt-2 mb-0">
                                Most discussed persons in The Guardian headlines
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CarouselPoi.propTypes = {
    poiData: PropTypes.arrayOf(
        PropTypes.shape({
            yearMonth: PropTypes.string.isRequired,
            persons: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ),
};

export default CarouselPoi;