import React from 'react';
import { getPoiMonthlyKvGuardian } from '../../lib/data';

const PoiMonthly = async () => {
    const poiData = await getPoiMonthlyKvGuardian();

    if (!poiData || poiData.length === 0) {
        return (
            <div className='container px-4 py-0 my-4'>
                <h1 className="fw-bold mb-3">Persons of Interest Monthly</h1>
                <div className="alert alert-info d-flex align-items-start" role="alert">
                    <svg className="bi flex-shrink-0 me-2 mt-1" width="24" height="24" role="img" aria-label="Info:">
                        <use xlinkHref="#info-fill"/>
                    </svg>
                    <div>
                        <h4 className="alert-heading">No Data Available</h4>
                        <p className="mb-0">There is no persons of interest data available at the moment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container px-4 py-0 my-4'>
            <div className="mb-4">
                <h1 className="fw-bold">Persons of Interest Monthly</h1>
                <p className="text-muted lead">
                    Most discussed persons in The Guardian headlines, organized by month.
                </p>
            </div>
            
            <div className="row g-4">
                {poiData.map((monthData) => {
                    const [year, month] = monthData.yearMonth.split('-');
                    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
                    
                    return (
                        <div key={monthData.yearMonth} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0 fw-semibold">
                                        {monthName} {year}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {monthData.persons.map((person, personIndex) => (
                                            <span key={personIndex} className="badge bg-primary">
                                                {person}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const dynamic = 'force-dynamic';

export default PoiMonthly;