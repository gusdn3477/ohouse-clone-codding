import dynamic from 'next/dynamic';
import type { GetStaticProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { prefetchHomeCatalogPreview } from '@/microfrontends/catalog/public';

const HomePage = dynamic(() => import('@/microfrontends/shell/HomePage'), {
  loading: () => <div className="py-16 text-center text-text-secondary">홈 화면을 불러오는 중...</div>,
});

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await prefetchHomeCatalogPreview(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3600,
  };
};
