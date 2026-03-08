import Head from 'next/head';
import Hero from '@/components/features/home/Hero';
import HomeCatalogWidgets from '@/microfrontends/catalog/components/HomeCatalogWidgets';

export default function HomePage() {
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
      <HomeCatalogWidgets />

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
