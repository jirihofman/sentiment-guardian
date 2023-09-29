import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import Main from '../components/layout/main';
import pjson from '../package.json';
/* ensure all pages have Bootstrap CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../style/index.css';

export default async function LocaleLayout({
    children
}) {
    return (
        <html>
            <head>
                <Script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3' crossOrigin='anonymous' defer />
            </head>
            <ClerkProvider>
                <body suppressHydrationWarning={true}>
                    <Main>
                        <main>{children}</main>
                    </Main>
                </body>
            </ClerkProvider>
        </html>
    );
}

export const metadata = {
    description: pjson.description,
    title: pjson.displayName,
};
