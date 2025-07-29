// import Hero from '../components/landing/hero';
import ArticleTable, { ArticleTableSkeleton } from '../components/landing/article-table';
import { Suspense } from 'react';
import PropTypes from 'prop-types';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams?.page) || 1;

    return (
        <div>
            <Suspense fallback={<ArticleTableSkeleton />}>
                <ArticleTable page={page} />
            </Suspense>
        </div>
    );
}

Home.propTypes = {
    searchParams: PropTypes.object,
};
