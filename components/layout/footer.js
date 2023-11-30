import { Suspense } from 'react';
import LastUpdated from './last-updated';

export default function Footer() {
    
    return (
        <footer className='navbar navbar-light bg-light'>
            <Suspense fallback={<span className="text-muted small">Loading...</span>}>
                <LastUpdated />
            </Suspense>
        </footer>
    );
}
