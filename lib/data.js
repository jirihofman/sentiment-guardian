const revalidate = 60;

// Using fetch to be able to use next.js revalidate.
export const getArticlesKvGuardian = async () => {

    const res = await fetch(`${process.env.KV_REST_API_URL}/pipeline`, {
        body: `[
        ["ZRANGE", "article:guardian", 0, -1, "REV", "LIMIT", 0, 20],
        ["INCR", "article:guardian:hits"]
    ]`,
        headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        method: 'POST',
        next: { revalidate },
    });

    const data = await res.json();
    const articles = data[0].result.map(article => JSON.parse(article));

    // eslint-disable-next-line no-console
    console.log('article:guardian:hits', data[1].result);

    return articles;
};
