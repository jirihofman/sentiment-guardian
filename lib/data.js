/** 20 minutes. Usually revalidated by CI curl call. */
const revalidate = 60 * 20;

// Using fetch to be able to use next.js revalidate.
export const getArticlesKvGuardian = async (offset = 0, limit = 20) => {

    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
        body: `[
        ["ZRANGE", "article:guardian", 0, -1, "REV", "LIMIT", ${offset}, ${limit}],
        ["INCR", "article:guardian:hits"]
    ]`,
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        method: 'POST',
        next: {
            revalidate,
            tags: ['article:guardian', 'article:guardian:hits']
        },
    });

    const data = await res.json();
    const articles = data[0].result.map(article => JSON.parse(article));

    // eslint-disable-next-line no-console
    console.log('getArticlesKvGuardian - article:guardian:hits', data[1].result);

    return articles;
};

export const getCategoriesSummaryKvGuardian = async () => {

    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
        body: `[
        ["GET", "category:guardian:NEG1"],
        ["GET", "category:guardian:NEG2"],
        ["GET", "category:guardian:NEU"],
        ["GET", "category:guardian:POS1"],
        ["GET", "category:guardian:POS2"],
        ["INCR", "article:guardian:hits"]
    ]`,
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        method: 'POST',
        next: {
            revalidate,
            tags: [
                'category:guardian',
                'article:guardian:hits',
            ],
        },
    });

    const data = await res.json();
    const hits = data[5].result;
    // eslint-disable-next-line no-console
    console.log('getCategoriesSummaryKvGuardian - article:guardian:hits', hits);

    return {
        '😭': parseInt(data[0].result, 10),
        // Holy sh!t ordering emojis :D
        // eslint-disable-next-line sort-keys
        '😔': parseInt(data[1].result, 10),
        // eslint-disable-next-line sort-keys
        '😐': parseInt(data[2].result, 10),
        '🙂': parseInt(data[3].result, 10),
        // eslint-disable-next-line sort-keys
        '😀': parseInt(data[4].result, 10),
    };
};

export const getCommentsKvGuardian = async () => {

    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
        body: `[
        ["GET", "ai-comment-text-openai"],
        ["GET", "ai-comment-date-openai"],
        ["GET", "ai-comment-audio-openai"],
        ["INCR", "article:guardian:hits"]
    ]`,
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        method: 'POST',
        next: {
            revalidate,
            tags: [
                'ai-comment-text-openai',
                'ai-comment-date-openai',
                'ai-comment-audio-openai',
                'article:guardian:hits',
            ],
        },
    });

    const data = await res.json();
    const hits = data[2].result;
    // eslint-disable-next-line no-console
    console.log('getCommentsKvGuardian - article:guardian:hits', hits);

    return {
        audio: data[2].result,
        comment: data[0].result,
        date: data[1].result,
    };
};
