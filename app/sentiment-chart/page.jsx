import SentimentChart from '../../components/sentiment-chart';

export const dynamic = 'force-dynamic';

export default function SentimentChartPage() {
    return (
        <div className="container px-4 py-0 my-3">
            <div className="mb-4">
                <h1>Sentiment Trends</h1>
                <p className="text-muted">
                    Visualize how Guardian headline sentiment changes over time with daily average sentiment scores.
                </p>
            </div>
            <SentimentChart />
        </div>
    );
}