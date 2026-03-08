import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate, DehydratedState } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRegisterServiceWorker } from '@/hooks/useRegisterServiceWorker';
import { ensureCartStoreReady } from '@/microfrontends/cart/store';
import { ensureRecentSearchesReady } from '@/microfrontends/search/store';
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

    useEffect(() => {
        ensureCartStoreReady();
        ensureRecentSearchesReady();
    }, []);

    useRegisterServiceWorker();

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </HydrationBoundary>
            </QueryClientProvider>
        </>
    );
}

export { dehydrate, QueryClient };
