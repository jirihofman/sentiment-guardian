'use client';

import PropTypes from 'prop-types';

const CarouselPoi = ({ poiData }) => {
    // Get the most recent month's data
    const latestPoi = poiData && poiData.length > 0 ? poiData[0] : null;

    if (!latestPoi) {
        return (
            <div className='p-3'>
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                        <h6 className="mb-0 fw-semibold">Person of Interest</h6>
                    </div>
                    <div className="card-body text-center" style={{ minHeight: '120px' }}>
                        <p className="text-muted mb-0">No data available</p>
                    </div>
                </div>
            </div>
        );
    }

    const [year, month] = latestPoi.yearMonth.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    return (
        <div className='p-3'>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-semibold">Persons of Interest</h6>
                    <small className="text-muted">{monthName} {year}</small>
                </div>
                <div className="card-body" style={{ minHeight: '120px' }}>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {latestPoi.persons.map((person, index) => (
                            <span key={index} className="badge bg-primary">
                                {person}
                            </span>
                        ))}
                    </div>
                    <p className="small text-muted mb-0">
                        Most discussed persons in The Guardian headlines
                    </p>
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