import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { CategoryDesktop, CategoryMobile } from '@/components/features/category/CategoryList';
import ProductCard from '@/components/features/product/ProductCard';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { useProductSort } from '@/hooks/useProductSort';
import { formatCategoryName } from '@/utils';
import {
  useCategories,
  useInfiniteProducts,
  useProductsByCategory,
  useSearchProducts,
} from '../api/hooks';

const DEFAULT_PAGE_SIZE = 12;

const VirtualProductGrid = dynamic(() => import('@/components/features/product/VirtualProductGrid'), {
  loading: () => <GridSkeleton />,
  ssr: false,
});

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="card h-80 animate-pulse" />
      ))}
    </div>
  );
}

export interface CatalogListPageProps {
  currentCategory: string | null;
  searchQuery: string | null;
}

export default function CatalogListPage({ currentCategory, searchQuery }: CatalogListPageProps) {
  const router = useRouter();
  const columns = useResponsiveColumns();
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const { data: categories = [] } = useCategories();
  const { data: categoryProducts = [] } = useProductsByCategory(currentCategory);
  const { data: searchResults = [] } = useSearchProducts(searchQuery);
  const hasScopedResults = Boolean(searchQuery || currentCategory);
  const { data: infiniteProducts } = useInfiniteProducts(DEFAULT_PAGE_SIZE, !hasScopedResults);
  const displayProducts = searchQuery
    ? searchResults
    : currentCategory
      ? categoryProducts
      : [];
  const { sortBy, handleSortChange, sortedProducts } = useProductSort(displayProducts);
  const totalCount = hasScopedResults
    ? displayProducts.length
    : (infiniteProducts?.pages[0]?.totalCount ?? 0);

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);

      startTransition(() => {
        if (category) {
          router.push(`/products?category=${encodeURIComponent(category)}`);
          return;
        }

        router.push('/products');
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
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-text">
              {searchQuery
                ? `"${searchQuery}" 검색 결과`
                : currentCategory
                  ? formatCategoryName(currentCategory)
                  : '전체 상품'}
            </h1>
            <p className="text-text-secondary mt-1">
              {hasScopedResults
                ? `${totalCount}개의 상품`
                : totalCount > 0
                  ? `${totalCount}개의 상품`
                  : '스크롤하면 더 많은 상품이 로드됩니다'}
            </p>
          </div>

          <CategoryMobile
            className="lg:hidden"
            categories={categories}
            currentCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          <CategoryDesktop
            className="hidden lg:block"
            categories={categories}
            currentCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-text-secondary">{totalCount}개 상품</span>
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

          <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {!hasScopedResults ? (
              <VirtualProductGrid columns={columns} pageSize={DEFAULT_PAGE_SIZE} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {displayProducts.length === 0 && hasScopedResults && (
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
