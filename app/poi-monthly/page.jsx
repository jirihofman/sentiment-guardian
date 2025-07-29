import React from 'react';

// Function to fetch POI data
const getPoiData = async () => {
    try {
        // Don't fetch during build time
        if (process.env.NODE_ENV === 'test' || !process.env.UPSTASH_REDIS_REST_URL) {
            return [];
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/poi-monthly`, {
            next: {
                // 24 hours
                revalidate: 60 * 60 * 24,
                tags: ['poi-monthly']
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch POI data:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching POI data:', error);
        return [];
    }
};

const PoiMonthly = async () => {
    const poiData = await getPoiData();

    if (!poiData || poiData.length === 0) {
        return (
            <div className='container px-4 py-0 my-3'>
                <h1 className="pb-2 border-bottom">Persons of Interest Monthly</h1>
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">No Data Available</h4>
                    <p>There is no persons of interest data available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container px-4 py-0 my-3'>
            <h1 className="pb-2 border-bottom">Persons of Interest Monthly</h1>
            <p className="text-muted mb-4">
                Most discussed persons in The Guardian headlines, organized by month.
            </p>
            
            <div className="row">
                {poiData.map((monthData) => {
                    const [year, month] = monthData.yearMonth.split('-');
                    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
                    
                    return (
                        <div key={monthData.yearMonth} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="card-title mb-0">
                                        {monthName} {year}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {monthData.persons.map((person, personIndex) => (
                                            <span key={personIndex} className="badge bg-secondary">
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