import dynamic from 'next/dynamic';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { CatalogDetailPageProps } from '@/microfrontends/catalog/public';
import {
  getCatalogDetailStaticPaths,
  prefetchCatalogDetail,
} from '@/microfrontends/catalog/public';

const CatalogDetailPage = dynamic(
  () => import('@/microfrontends/catalog/public').then((module) => module.CatalogDetailPage),
  {
    loading: () => <div className="py-16 text-center text-text-secondary">상품 상세를 불러오는 중...</div>,
  }
);

export default CatalogDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getCatalogDetailStaticPaths();
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<CatalogDetailPageProps> = async ({ params }) => {
  const id = Number(params?.id);
  if (Number.isNaN(id)) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();

  try {
    await prefetchCatalogDetail(queryClient, id);

    return {
      props: {
        productId: id,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 3600,
    };
  } catch {
    return { notFound: true };
  }
};
