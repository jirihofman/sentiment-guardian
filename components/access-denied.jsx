import Link from 'next/link';

export default function AccessDenied() {

    return (
        <div style={{ borderLeft: '2px solid red', padding: '10px 30px' }}>
            <h1>Access denied</h1>
            <p>
                <Link href="/api/auth/signin" legacyBehavior>Access denied</Link>
            </p>
        </div>
    );
}
