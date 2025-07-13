// import Hero from '../components/landing/hero';
import ArticleTable, { ArticleTableSkeleton } from '../components/landing/article-table';
import SentimentChart from '../components/sentiment-chart';
import { Suspense } from 'react';
import PropTypes from 'prop-types';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams?.page) || 1;

    return (
        <div>
            <div className="container px-4 py-0 my-3">
                <SentimentChart />
            </div>
            <Suspense fallback={<ArticleTableSkeleton />}>
                <ArticleTable page={page} />
            </Suspense>
        </div>
    );
}

Home.propTypes = {
    searchParams: PropTypes.object,
};
