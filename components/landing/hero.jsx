import pjson from '../../package.json';
import Buttons from '../buttons';

const Hero = () => {

    return (
        <div className="px-4 py-2 my-3 text-center">
            <h1 className="display-5 fw-bold">{pjson.displayName}</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-0">
                    📰
                    {' Rise and shine or doom and gloom? Find out the sentiment of the Guardian\'s articles.'}
                </p>
                <Buttons />
            </div>
        </div>
    );
};

export default Hero;
