import pjson from '../../package.json';
import { MODEL_GPT_SENTIMENT, MODEL_GPT_COMMENTS } from '../../lib/const';
import PropTypes from 'prop-types';

export default function Faq() {

    const articlesCheckedEveryXMinutes = 20;

    const data = [
        {
            answer: <>
                {pjson.description}
                <span>
                    {`It periodically (every ${articlesCheckedEveryXMinutes} minutes) loads headlines from The Guardian and evaluates their sentiment using OpenAI's `}
                    <code>{MODEL_GPT_SENTIMENT} </code>
                    <a href='https://platform.openai.com/docs/models' rel='noreferrer' target='_blank'>model</a>.
                </span>
            </>,
            question: `What is ${pjson.displayName}?`,
        },
        {
            answer: <code>Determine sentiment of the following headline as a number from range 1-100. 100 is the most positive. Return only the number. Title: ARTICLE_TITLE</code>,
            question: 'What prompt does it use to get the sentiment?',
        },
        {
            answer: <span>
                {'The commentary is updated twice a day - at 8am and 8pm UTC and the following model is used: '}
                <code>{MODEL_GPT_COMMENTS}</code>.
            </span>,
            question: 'How often is the commentary updated? And what model is used?',
        },
        {
            answer: 'To track many more outlets, and to provide more detailed analysis.',
            question: 'What are the plans for the future?',
        },
        {
            answer: 'Yes.',
            question: 'Will there be more FAQs?',
        },
    ];

    return <div className='container-xxl'>

        <h1>FAQ</h1>
        {data.map((q, i) =>
            <div className='col-10 float-left clearfix mb-3 mb-md-2' key={i}>
                <h2>
                    <span className='f4 lh-big faq-q'>{`${i + 1}. ${q.question}`}</span>
                </h2>
                <div className='col-10 mt-3'>
                    <div className='ms-4 d-flex flex-wrap faq-a'>
                        {q.answer}
                    </div>
                </div>
            </div>
        )}
    </div>;
}

Faq.propTypes = {
    data: PropTypes.array.isRequired,
};

export const metadata = {
    description: pjson.description,
    title: 'FAQ - ' + pjson.displayName,
};
