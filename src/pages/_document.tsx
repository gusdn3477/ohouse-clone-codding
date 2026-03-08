import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />

                {/* Default SEO - 페이지별로 오버라이드 가능 */}
                <meta name="description" content="오늘의샵에서 가구, 소품, 인테리어 용품을 빠르게 둘러보고 장바구니에 담아보세요." />
                <meta name="keywords" content="오늘의샵, 인테리어, 가구, 소품, 온라인쇼핑" />
                <meta name="application-name" content="오늘의샵" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="오늘의샵" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#35c5f0" />
                <meta name="format-detection" content="telephone=no" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="오늘의샵" />
                <meta property="og:locale" content="ko_KR" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />

                {/* Favicon */}
                <link rel="manifest" href="/manifest.webmanifest" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="icon" type="image/svg+xml" href="/icon.svg" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
