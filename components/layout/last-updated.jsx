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
        <div className="d-flex align-items-center gap-2 text-muted small">
            <svg width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
            <span>Articles last checked: <strong>{date} UTC</strong></span>
        </div>
    );
}
