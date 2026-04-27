import Link from 'next/link';
import Hero from '@/components/features/home/Hero';
import ProductCard from '@/components/features/product/ProductCard';
import { getCategories, getStaticProducts } from '@/server/catalog';
import { formatCategoryName, getCategoryEmoji } from '@/utils';

export const revalidate = 3600;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getStaticProducts(), getCategories()]);
  const featuredProducts = products.slice(0, 8);

  return (
    <>
      <Hero />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text lg:text-2xl">카테고리</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              전체 보기
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="card p-6 text-center transition-all hover:-translate-y-1"
              >
                <div className="mb-3 text-3xl">{getCategoryEmoji(category)}</div>
                <span className="text-sm font-medium text-text">
                  {formatCategoryName(category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text lg:text-2xl">인기 상품</h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              전체 보기
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {[
              { icon: '🚚', title: '무료 배송', desc: '5만원 이상 무료' },
              { icon: '🔄', title: '간편 반품', desc: '30일 이내 무료' },
              { icon: '🔒', title: '안전 결제', desc: 'SSL 암호화' },
              { icon: '💬', title: '고객 지원', desc: '24시간 상담' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-1 font-bold text-text">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
