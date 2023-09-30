import pjson from '../../package.json';

const Hero = () => {

    return (
        <div className="px-4 py-2 my-3 text-center d-none d-md-table-cell">
            <span className="display-6 fw-bold">{pjson.displayName}</span>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-0">
                    📰
                    {' Rise and shine or doom and gloom? Find out the sentiment of the Guardian\'s articles.'}
                </p>
            </div>
        </div>
    );
};

export default Hero;
