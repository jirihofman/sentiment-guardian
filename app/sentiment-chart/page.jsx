import SentimentChart from '../../components/sentiment-chart';

export const dynamic = 'force-dynamic';

export default function SentimentChartPage() {
    return (
        <div className="container px-4 py-0 my-4">
            <div className="mb-4">
                <h1 className="fw-bold">Sentiment Trends</h1>
                <p className="text-muted lead">
                    Visualize how Guardian headline sentiment changes over time with daily average sentiment scores.
                </p>
            </div>
            <SentimentChart height={500} />
        </div>
    );
}