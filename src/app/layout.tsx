import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import WebVitals from '@/components/monitoring/WebVitals';
import Providers from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://todayshop.vercel.app'),
  title: {
    default: '오늘의샵 - 세상 모든 인테리어 쇼핑',
    template: '%s | 오늘의샵',
  },
  description: '오늘의샵에서 가구, 소품, 인테리어 용품을 만나보세요.',
  keywords: ['온라인쇼핑', '인테리어', '가구', '소품', '오늘의샵'],
  openGraph: {
    type: 'website',
    siteName: '오늘의샵',
    locale: 'ko_KR',
    title: '오늘의샵 - 세상 모든 인테리어 쇼핑',
    description: '가구부터 소품까지. 당신의 공간을 특별하게.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <WebVitals />
        <Providers>
          <div className="flex min-h-screen flex-col bg-background-secondary">
            <Suspense fallback={<div className="h-16 bg-white shadow-header" />}>
              <Header />
            </Suspense>
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
