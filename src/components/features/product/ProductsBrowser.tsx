'use client';

import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/features/product/ProductCard';
import { CategoryMobile, CategoryDesktop } from '@/components/features/category/CategoryList';
import { useProductSort } from '@/hooks/useProductSort';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { formatCategoryName } from '@/utils';
import { Product } from '@/types';
import VirtualProductGrid from './VirtualProductGrid';

interface ProductsBrowserProps {
  categories: string[];
  currentCategory: string | null;
  searchQuery: string | null;
  products: Product[];
}

export default function ProductsBrowser({
  categories,
  currentCategory,
  searchQuery,
  products,
}: ProductsBrowserProps) {
  const router = useRouter();
  const columns = useResponsiveColumns();
  const [isPending, startTransition] = useTransition();
  const { sortBy, handleSortChange, sortedProducts } = useProductSort(products);

  const handleCategoryChange = useCallback(
    (category: string | null) => {
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

  const title = searchQuery
    ? `"${searchQuery}" 검색 결과`
    : currentCategory
      ? formatCategoryName(currentCategory)
      : '전체 상품';
  const isVirtualized = !currentCategory && !searchQuery;

  return (
    <div className="py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text lg:text-3xl">{title}</h1>
          <p className="mt-1 text-text-secondary">
            {isVirtualized ? '스크롤하면 더 많은 상품이 로드됩니다' : `${products.length}개의 상품`}
          </p>
        </div>

        <CategoryMobile
          className="lg:hidden"
          categories={categories}
          currentCategory={currentCategory}
          onSelectCategory={handleCategoryChange}
        />

        <CategoryDesktop
          className="hidden lg:block"
          categories={categories}
          currentCategory={currentCategory}
          onSelectCategory={handleCategoryChange}
        />

        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {isVirtualized ? '전체 상품' : `${products.length}개 상품`}
          </span>
          {!isVirtualized && (
            <select
              className="cursor-pointer rounded-lg border border-border bg-white px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="default">추천순</option>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="rating">평점순</option>
            </select>
          )}
        </div>

        <div
          className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}
        >
          {isVirtualized ? (
            <VirtualProductGrid columns={columns} pageSize={12} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {products.length === 0 && !isVirtualized && (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-bold text-text">상품을 찾을 수 없습니다</h3>
            <p className="text-text-secondary">다른 검색어나 카테고리를 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
