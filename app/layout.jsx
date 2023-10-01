import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import Main from '../components/layout/main';
import pjson from '../package.json';
/* ensure all pages have Bootstrap CSS */
import '../style/index.css';

export default async function LocaleLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <Script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3' crossOrigin='anonymous' defer />
            </head>
            <body suppressHydrationWarning={true}>
                <Main>
                    <main>{children}</main>
                </Main>
                <Analytics />
            </body>
        </html>
    );
}

export const metadata = {
    description: pjson.description,
    title: pjson.displayName,
};
