import Hero from '../components/landing/hero';
import ArticleTable, { ArticleTableSkeleton } from '../components/landing/article-table';
import { Suspense } from 'react';

export default function Home() {

    return (
        <div>
            <Hero />
            <Suspense fallback={<ArticleTableSkeleton />}>
                <ArticleTable />
            </Suspense>
        </div>
    );
}
