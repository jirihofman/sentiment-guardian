import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import Main from '../components/layout/main';
import pjson from '../package.json';
import PropTypes from 'prop-types';
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

/** @type {import('next').Metadata} */
export const metadata = {
    description: pjson.description,
    // Thanks https://css-tricks.com/emoji-as-a-favicon/
    icons: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📰</text></svg>',
    robots: {
        follow: true,
        googleBot: {
            follow: true,
            index: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
        index: true,
    },
    title: pjson.displayName,
};

LocaleLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
