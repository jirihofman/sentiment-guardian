const CarouselCommentary = async ({ comment, model }) => {

    const cardBodyStyle = {
        maxHeight: '70px',
        minHeight: '70px',
        overflow: 'hidden',
    };

    return (
        <div className='mx-0 p-0'>
            <div className="row row-cols-1 row-cols-1 g-2 mb-0">
                <div className="col">
                    <div className="card h-100">
                        <div className="card-header">
                            Commentary <audio controls src={`/foo/bar/${model}`} style={{ float: 'right', maxHeight: '24px', overflow: 'hidden', width: '150px' }} />
                        </div>
                        <div className="card-body p-0 m-0 text-center" style={cardBodyStyle}>
                            <cite title="Our AI says"> {comment}</cite>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarouselCommentary;
