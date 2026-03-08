import Link from 'next/link';
import ProductCard from '@/components/features/product/ProductCard';
import { formatCategoryName, getCategoryEmoji } from '@/utils';
import { useCategories, useFeaturedProducts } from '../api/hooks';

export default function HomeCatalogWidgets() {
  const { data: categories = [] } = useCategories();
  const { data: featuredProducts = [] } = useFeaturedProducts(8);

  return (
    <>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-text">카테고리</h2>
            <Link href="/products" legacyBehavior>
              <a className="text-sm text-primary font-medium hover:underline">전체 보기</a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                legacyBehavior
              >
                <a className="card p-6 text-center hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-3">{getCategoryEmoji(category)}</div>
                  <span className="text-sm font-medium text-text">{formatCategoryName(category)}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-text">인기 상품</h2>
            <Link href="/products" legacyBehavior>
              <a className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                전체 보기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
