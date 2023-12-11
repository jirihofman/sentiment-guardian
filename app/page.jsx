// import Hero from '../components/landing/hero';
import ArticleTable, { ArticleTableSkeleton } from '../components/landing/article-table';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Home() {

    return (
        <div>
            <Suspense fallback={<ArticleTableSkeleton />}>
                <ArticleTable />
            </Suspense>
        </div>
    );
}
