import { Suspense } from 'react';
import LastUpdated from './last-updated';

export default function Footer() {
    
    return (
        <footer className='navbar'>
            <div className="container-fluid">
                <Suspense fallback={<span className="text-muted small">Loading...</span>}>
                    <LastUpdated />
                </Suspense>
            </div>
        </footer>
    );
}
