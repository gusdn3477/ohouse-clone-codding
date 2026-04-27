'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  link: string;
  emoji: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: '신규 회원 특별 할인',
    subtitle: '가입 즉시 15% 할인 쿠폰 증정',
    bgColor: 'bg-gradient-to-r from-primary to-cyan-400',
    textColor: 'text-white',
    link: '/products',
    emoji: '🎉',
  },
  {
    id: 2,
    title: '이번 주 베스트 셀러',
    subtitle: '가장 인기있는 상품들을 만나보세요',
    bgColor: 'bg-gradient-to-r from-orange-400 to-pink-500',
    textColor: 'text-white',
    link: '/products',
    emoji: '🔥',
  },
  {
    id: 3,
    title: '무료 배송 이벤트',
    subtitle: '5만원 이상 구매 시 무료 배송',
    bgColor: 'bg-gradient-to-r from-violet-500 to-purple-500',
    textColor: 'text-white',
    link: '/products',
    emoji: '🚚',
  },
];

const Hero = function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative overflow-hidden">
      {/* Banner Slider */}
      <div className={`${currentBanner.bgColor} transition-all duration-500`}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className={`text-center lg:text-left ${currentBanner.textColor}`}>
              <span className="mb-4 block text-5xl">{currentBanner.emoji}</span>
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {currentBanner.title}
              </h1>
              <p className="mb-8 text-lg opacity-90 sm:text-xl">{currentBanner.subtitle}</p>
              <Link
                href={currentBanner.link}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-8 py-4 text-lg font-semibold text-text transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-lg"
              >
                쇼핑하러 가기
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
        aria-label="이전"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
        aria-label="다음"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
