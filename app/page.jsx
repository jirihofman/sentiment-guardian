import Hero from '../components/landing/hero';
import Feature, { ArticleTableSkeleton } from '../components/landing/feature';
import { Suspense } from 'react';

export default function Home() {

    return (
        <div>
            <Hero />
            <Suspense fallback={<ArticleTableSkeleton />}>
                <Feature />
            </Suspense>
        </div>
    );
}
