'use client';

import React from 'react';
import { InfoCircleFill } from 'react-bootstrap-icons';

const CarouselEducational = () => {

    const hints = [
        "Plane crashes always make the news, but car crashes, which kill far more people, almost never do.",
        "Not surprisingly, many people have a fear of flying, but almost no one has a fear of driving.",
        "People rank tornadoes (which kill about 50 Americans a year) as a more common cause of death than asthma (which kills more than 4,000 Americans a year), presumably because tornadoes make for better television."
    ];

    return (
        <div className='p-3'>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                    <div className="d-flex align-items-center gap-2">
                        <InfoCircleFill className="text-primary" />
                        <h6 className="mb-0 fw-semibold">About Media Negativity</h6>
                    </div>
                    <small className="text-muted">Understanding news bias</small>
                </div>
                <div className="card-body" style={{ minHeight: '120px', maxHeight: '120px', overflow: 'auto' }}>
                    <div className="mb-2">
                        <small className="text-muted">
                            <a 
                                href="https://www.theguardian.com/commentisfree/2018/feb/17/steven-pinker-media-negative-news"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                            >
                                Interesting info on this topic →
                            </a>
                        </small>
                    </div>
                    <ul className="list-unstyled mb-0 small text-secondary">
                        {hints.map((hint, index) => (
                            <li key={index} className="mb-2">
                                <span className="text-primary me-1">•</span>
                                {hint}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CarouselEducational;
