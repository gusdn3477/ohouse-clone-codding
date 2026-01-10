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
                <meta name="description" content="LUXESHOP - 프리미엄 쇼핑 경험. 전자기기, 패션, 주얼리 등 엄선된 제품들을 만나보세요." />
                <meta name="keywords" content="온라인쇼핑, 프리미엄, 전자기기, 패션, 주얼리" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="LUXESHOP" />
                <meta property="og:locale" content="ko_KR" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />

                {/* Favicon */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
