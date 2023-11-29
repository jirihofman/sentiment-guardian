export default async function LastUpdated() {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/articles-last-updated`, {
        headers: {
            Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN,
        }
    });
    const data = await res.json();
    // Format `data.result` to YYYY-MM-DD HH:MM:SS UTC
    const date = new Date(data.result).toISOString().replace('T', ' ').replace(/\..+/, '');

    return (
        <div className="text-muted small">
			Sentiment last updated: {date}
        </div>
    );
}
