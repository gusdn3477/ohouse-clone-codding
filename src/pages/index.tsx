import { GetStaticProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import { useProducts, useCategories, prefetchProducts, prefetchCategories } from '@/lib/api';
import { formatCategoryName, getCategoryEmoji } from '@/utils';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const featuredProducts = products.slice(0, 8);

  return (
    <>
      <Head>
        <title>오늘의샵 - 세상 모든 인테리어 쇼핑</title>
        <meta
          name="description"
          content="오늘의샵에서 가구, 소품, 인테리어 용품을 만나보세요. 최고 품질의 제품들을 합리적인 가격에!"
        />
        <meta property="og:title" content="오늘의샵 - 세상 모든 인테리어 쇼핑" />
        <meta property="og:description" content="가구부터 소품까지. 당신의 공간을 특별하게." />
        <link rel="canonical" href="https://todayshop.vercel.app" />
      </Head>

      <Hero />

      {/* Categories Section */}
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

      {/* Featured Products Section */}
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

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: '🚚', title: '무료 배송', desc: '5만원 이상 무료' },
              { icon: '🔄', title: '간편 반품', desc: '30일 이내 무료' },
              { icon: '🔒', title: '안전 결제', desc: 'SSL 암호화' },
              { icon: '💬', title: '고객 지원', desc: '24시간 상담' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-text mb-1">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await Promise.all([prefetchProducts(queryClient), prefetchCategories(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3600,
  };
};
