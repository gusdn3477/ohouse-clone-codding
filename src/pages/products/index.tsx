import dynamic from 'next/dynamic';
import type { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { CatalogListPageProps } from '@/microfrontends/catalog/public';
import { prefetchCatalogList } from '@/microfrontends/catalog/public';

const CatalogListPage = dynamic(
  () => import('@/microfrontends/catalog/public').then((module) => module.CatalogListPage),
  {
    loading: () => <div className="py-16 text-center text-text-secondary">상품 목록을 불러오는 중...</div>,
  }
);

export default CatalogListPage;

export const getServerSideProps: GetServerSideProps<CatalogListPageProps> = async ({ query }) => {
  const currentCategory = typeof query.category === 'string' ? query.category : null;
  const searchQuery = typeof query.search === 'string' ? query.search : null;
  const queryClient = new QueryClient();

  await prefetchCatalogList(queryClient, {
    currentCategory,
    searchQuery,
  });

  return {
    props: {
      currentCategory,
      searchQuery,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
