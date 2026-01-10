import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import ProductCard from '@/components/ProductCard';
import CategoryButton from '@/components/CategoryButton';
import { formatCategoryName } from '@/utils';

const VirtualProductGrid = dynamic(() => import('@/components/VirtualProductGrid'), {
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

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

interface ProductsPageProps {
  currentCategory: string | null;
  searchQuery: string | null;
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
}

export default function ProductsPage({ currentCategory, searchQuery }: ProductsPageProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const columns = useResponsiveColumns();

  // Category Drag Scroll State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: products = [] } = useProductsByCategory(currentCategory);
  const { data: searchResults = [] } = useSearchProducts(searchQuery || '');
  const { data: categories = [] } = useCategories();

  const displayProducts = searchQuery ? searchResults : products;

  const sortedProducts = useMemo(() => {
    const sorted = [...displayProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [displayProducts, sortBy]);

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      if (isDragging) return; // 드래그 중인 경우 클릭 방지
      if (category) {
        router.push(`/products?category=${encodeURIComponent(category)}`);
      } else {
        router.push('/products');
      }
    },
    [router, isDragging]
  );

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  }, []);

  // Mouse Event Handlers for Drag Scroll
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Button Click Handlers (Arrow Buttons)
  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

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

          {/* Category Pills with Drag Scroll */}
          <div className="relative mb-6 group">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollByAmount(-200)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-background-secondary transition-colors opacity-0 group-hover:opacity-100 duration-200"
              aria-label="이전 카테고리"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className={`overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-4 pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              <div className="flex gap-2 min-w-max">
                <CategoryButton isActive={!currentCategory && !searchQuery} onClick={() => handleCategoryChange(null)}>
                  전체
                </CategoryButton>
                {categories.map((category) => (
                  <CategoryButton
                    key={category}
                    isActive={currentCategory === category}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {formatCategoryName(category)}
                  </CategoryButton>
                ))}
              </div>
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollByAmount(200)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-background-secondary transition-colors opacity-0 group-hover:opacity-100 duration-200"
              aria-label="다음 카테고리"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

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

          {/* Products */}
          {!currentCategory && !searchQuery ? (
            <VirtualProductGrid columns={columns} pageSize={12} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

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
