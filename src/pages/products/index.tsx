import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect, useTransition } from 'react';
import dynamic from 'next/dynamic';
import {
  useProductsByCategory,
  useCategories,
  useSearchProducts,
  prefetchCategories,
  queryKeys,
  fetchAllProducts,
  fetchProductsByCategory as fetchProductsByCategoryFn,
  prefetchInfiniteProducts,
} from '@/lib/api';
import ProductCard from '@/components/features/product/ProductCard';
import { CategoryMobile, CategoryDesktop } from '@/components/features/category/CategoryList';
import { formatCategoryName } from '@/utils';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { useProductSort } from '@/hooks/useProductSort';

const VirtualProductGrid = dynamic(() => import('@/components/features/product/VirtualProductGrid'), {
  ssr: false,
  loading: () => <GridSkeleton />,
});

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card h-80 animate-pulse" />
      ))}
    </div>
  );
}

interface ProductsPageProps {
  currentCategory: string | null;
  searchQuery: string | null;
}

export default function ProductsPage({ currentCategory, searchQuery }: ProductsPageProps) {
  const router = useRouter();
  const columns = useResponsiveColumns();
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const { data: products = [] } = useProductsByCategory(currentCategory);
  const { data: searchResults = [] } = useSearchProducts(searchQuery || '');
  const { data: categories = [] } = useCategories();

  const displayProducts = searchQuery ? searchResults : products;

  // Uses the custom hook for sorting logic
  const { sortBy, handleSortChange, sortedProducts } = useProductSort(displayProducts);

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      // Immediate UI update
      setSelectedCategory(category);

      // Low priority navigation
      startTransition(() => {
        if (category) {
          router.push(`/products?category=${encodeURIComponent(category)}`);
        } else {
          router.push('/products');
        }
      });
    },
    [router]
  );

  const pageTitle = searchQuery
    ? `"${searchQuery}" 검색 결과 - 오늘의샵`
    : currentCategory
      ? `${formatCategoryName(currentCategory)} - 오늘의샵`
      : '전체 상품 - 오늘의샵';

  const pageDescription = searchQuery
    ? `"${searchQuery}" 검색 결과입니다.`
    : currentCategory
      ? `오늘의샵의 ${formatCategoryName(currentCategory)} 카테고리입니다.`
      : '오늘의샵의 모든 상품을 둘러보세요.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <div className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-text">
              {searchQuery
                ? `"${searchQuery}" 검색 결과`
                : currentCategory
                  ? formatCategoryName(currentCategory)
                  : '전체 상품'}
            </h1>
            <p className="text-text-secondary mt-1">
              {(searchQuery || currentCategory) ? `${displayProducts.length}개의 상품` : '스크롤하면 더 많은 상품이 로드됩니다'}
            </p>
          </div>

          {/* Category List - Mobile (Scroll) */}
          <CategoryMobile
            className="lg:hidden"
            categories={categories}
            currentCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Category List - Desktop (Grid) */}
          <CategoryDesktop
            className="hidden lg:block"
            categories={categories}
            currentCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-text-secondary">
              {displayProducts.length}개 상품
            </span>
            <select
              className="px-4 py-2 bg-white border border-border text-text rounded-lg text-sm cursor-pointer focus:outline-none focus:border-primary"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="default">추천순</option>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="rating">평점순</option>
            </select>
          </div>

          {/* Products with Transition Effect */}
          <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {!currentCategory && !searchQuery ? (
              <VirtualProductGrid columns={columns} pageSize={12} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {displayProducts.length === 0 && (searchQuery || currentCategory) && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-text mb-2">상품을 찾을 수 없습니다</h3>
              <p className="text-text-secondary">다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async ({ query }) => {
  const category = typeof query.category === 'string' ? query.category : null;
  const search = typeof query.search === 'string' ? query.search : null;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: category ? queryKeys.productsByCategory(category) : queryKeys.products,
      queryFn: () => (category ? fetchProductsByCategoryFn(category) : fetchAllProducts()),
    }),
    prefetchCategories(queryClient),
    !category && !search && prefetchInfiniteProducts(queryClient, 12),
  ]);

  return {
    props: {
      currentCategory: category,
      searchQuery: search,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
