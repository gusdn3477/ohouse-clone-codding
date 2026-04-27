import type { Metadata } from 'next';
import ProductsBrowser from '@/components/features/product/ProductsBrowser';
import { getCategories, getProductsByCategory, searchCatalogProducts } from '@/server/catalog';
import { formatCategoryName } from '@/utils';

export const revalidate = 3600;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

function normalizeParam(value: string | undefined) {
  return value && value.trim().length > 0 ? value : null;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = normalizeParam(params.category);
  const search = normalizeParam(params.search);

  const title = search
    ? `"${search}" 검색 결과 - 오늘의샵`
    : category
      ? `${formatCategoryName(category)} - 오늘의샵`
      : '전체 상품 - 오늘의샵';

  const description = search
    ? `"${search}" 검색 결과입니다.`
    : category
      ? `오늘의샵의 ${formatCategoryName(category)} 카테고리입니다.`
      : '오늘의샵의 모든 상품을 둘러보세요.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = normalizeParam(params.category);
  const search = normalizeParam(params.search);

  const categoriesPromise = getCategories();
  const productsPromise = search
    ? searchCatalogProducts(search).then((response) => response.products)
    : category
      ? getProductsByCategory(category).then((response) => response.products)
      : Promise.resolve([]);

  const [categories, products] = await Promise.all([categoriesPromise, productsPromise]);

  return (
    <ProductsBrowser
      categories={categories}
      currentCategory={category}
      searchQuery={search}
      products={products}
    />
  );
}
