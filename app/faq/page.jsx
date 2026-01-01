import pjson from '../../package.json';
import { MODEL_GPT_SENTIMENT, MODEL_GPT_COMMENTS } from '../../lib/const';

export default function Faq() {

    const articlesCheckedEveryXMinutes = 20;

    const data = [
        {
            answer: <>
                {pjson.description}
                <span>
                    {` It periodically (every ${articlesCheckedEveryXMinutes} minutes) loads headlines from The Guardian and evaluates their sentiment using OpenAI's `}
                    <code className="px-2 py-1 bg-light rounded">{MODEL_GPT_SENTIMENT}</code>
                    {' '}
                    <a href='https://platform.openai.com/docs/models' rel='noreferrer' target='_blank'>model</a>.
                </span>
            </>,
            question: `What is ${pjson.displayName}?`,
        },
        {
            answer: <code className="d-block p-3 bg-light rounded">Determine sentiment of the following headline as a number from range 1-100. 100 is the most positive. Return only the number. Title: ARTICLE_TITLE</code>,
            question: 'What prompt does it use to get the sentiment?',
        },
        {
            answer: <span>
                {'The commentary is updated twice a day - at 8am and 8pm UTC and the following model is used: '}
                <code className="px-2 py-1 bg-light rounded">{MODEL_GPT_COMMENTS}</code>.
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

    return <div className='container px-4 py-0 my-4'>

        <div className="mb-4">
            <h1 className="fw-bold">Frequently Asked Questions</h1>
            <p className="text-muted lead">Everything you need to know about The Sentiment of The Guardian</p>
        </div>

        <div className="row">
            <div className="col-12 col-lg-10">
                {data.map((q, i) =>
                    <div className='mb-5' key={i}>
                        <div className="d-flex align-items-start mb-3">
                            <span className="badge bg-primary me-3 mt-1" style={{ fontSize: '1rem' }}>{i + 1}</span>
                            <h3 className="fw-semibold mb-0">{q.question}</h3>
                        </div>
                        <div className='ms-5 text-secondary' style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
                            {q.answer}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>;
}

export const metadata = {
    description: pjson.description,
    title: 'FAQ - ' + pjson.displayName,
};
