// Mock data endpoint for testing pagination
const mockArticles = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Guardian Article ${i + 1}`,
    sentiment: ['NEG2', 'NEG1', 'NEU', 'POS1', 'POS2'][Math.floor(Math.random() * 5)],
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    link: `https://www.theguardian.com/mock-article-${i + 1}`,
}));

export async function GET(request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const articles = mockArticles.slice(offset, offset + limit);
    
    return Response.json({
        articles,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockArticles.length / limit),
            totalItems: mockArticles.length,
            itemsPerPage: limit
        }
    });
}