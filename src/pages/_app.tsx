import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate, DehydratedState } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import Layout from '@/components/layout/Layout';
import '../styles/globals.css';

// pageProps 타입 정의
type PageProps = {
    dehydratedState?: DehydratedState;
    [key: string]: unknown;
};

export default function App({ Component, pageProps }: AppProps<PageProps>) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1분
                        gcTime: 5 * 60 * 1000, // 5분
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0f172a" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <CartProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </CartProvider>
                </HydrationBoundary>
            </QueryClientProvider>
        </>
    );
}

export { dehydrate, QueryClient };
