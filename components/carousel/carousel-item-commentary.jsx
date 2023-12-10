'use client';

import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; 
import PropTypes from 'prop-types';

const CarouselCommentary = ({ comments, model }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cardBodyStyle = {
        maxHeight: '120px',
        minHeight: '120px',
        overflow: 'hidden',
    };

    return (
        <div className='mx-0 p-0'>
            <div className="row row-cols-1 row-cols-1 g-2 mb-0">
                <div className="col">
                    <div className="card h-100">
                        {/* The `style` is for Safari maxHeight audio hack */}
                        <div className="card-header" style={{ maxHeight: '41px' }}>
                            Commentary <audio controls src={`/foo/bar/${model}`} style={{ float: 'right', maxHeight: '24px', overflow: 'hidden', width: '150px' }} />
                        </div>
                        <div className="card-body p-0 m-0 text-center" style={cardBodyStyle}>
                            <cite title="Our AI says"> {comments.comment.slice(0, 100)}...</cite>

                            <Button variant="primary" onClick={handleShow}>
                                Show Full Comment
                            </Button>

                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Full Comment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{comments.comment}</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CarouselCommentary.propTypes = {
    comments: PropTypes.object.isRequired,
    model: PropTypes.string.isRequired,
};

export default CarouselCommentary;
