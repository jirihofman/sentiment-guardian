/** 20 minutes. Usually revalidated by CI curl call. */
const revalidate = 60 * 20;

export default async function LastUpdated() {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/articles-last-updated`, {
        headers: {
            Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN,
        },
        next: {
            revalidate,
            tags: [
                'category:guardian',
                'article:guardian:hits',
            ],
        },
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
