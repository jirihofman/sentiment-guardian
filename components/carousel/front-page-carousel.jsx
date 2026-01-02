'use client';

import { Carousel } from 'react-bootstrap';
import CarouselSummary from './carousel-item-summary';
import CarouselCommentary from './carousel-item-commentary';
import CarouselPoi from './carousel-item-poi';
import PropTypes from 'prop-types';

const carouselItemStyle = {
    maxHeight: '200px',
    overflow: 'hidden',
};

const FrontPageCarousel = ({ articles, comments, summary, poiData, model }) => (
    <Carousel 
        controls={true} 
        indicators={false} 
        variant='dark' 
        interval={null} 
        className='mb-4'
        style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
    >
        <Carousel.Item style={carouselItemStyle}>
            <CarouselSummary articles={articles} summary={summary} />
        </Carousel.Item>
        <Carousel.Item style={carouselItemStyle}>
            <CarouselCommentary comments={comments} model={model} />
        </Carousel.Item>
        <Carousel.Item style={carouselItemStyle}>
            <CarouselPoi poiData={poiData} />
        </Carousel.Item>
    </Carousel>
);

FrontPageCarousel.propTypes = {
    articles: PropTypes.array.isRequired,
    comments: PropTypes.object.isRequired,
    summary: PropTypes.array.isRequired,
    poiData: PropTypes.array,
    model: PropTypes.string.isRequired,
};

export default FrontPageCarousel;
