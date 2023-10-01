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
    console.log('getArticlesKvGuardian - article:guardian:hits', data[1].result);

    return articles;
};

export const getCategoriesSummaryKvGuardian = async () => {

    const res = await fetch(`${process.env.KV_REST_API_URL}/pipeline`, {
        body: `[
        ["GET", "category:guardian:NEG1"],
        ["GET", "category:guardian:NEG2"],
        ["GET", "category:guardian:NEU"],
        ["GET", "category:guardian:POS1"],
        ["GET", "category:guardian:POS2"],
        ["INCR", "article:guardian:hits"]
    ]`,
        headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        method: 'POST',
        next: { revalidate },
    });

    const data = await res.json();
    const NEG1 = data[0].result;
    const NEG2 = data[1].result;
    const NEU = data[2].result;
    const POS1 = data[3].result;
    const POS2 = data[4].result;

    const hits = data[5].result;
    // eslint-disable-next-line no-console
    console.log('getCategoriesSummaryKvGuardian - article:guardian:hits', hits);

    return { NEG1, NEG2, NEU, POS1, POS2 };
};
