'use client';

import { useRef, useCallback, useMemo, useEffect, memo, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteProducts } from '@/lib/api';
import { Product } from '@/types';
import { throttle } from '@/utils';
import ProductCard from './ProductCard';

interface VirtualProductGridProps {
  columns?: number;
  pageSize?: number;
}

const VirtualProductGrid = memo(function VirtualProductGrid({
  columns = 4,
  pageSize = 12,
}: VirtualProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);

  // 컨테이너의 시작 위치 계산 (스크롤 오프셋 보정용)
  useEffect(() => {
    if (containerRef.current) {
      setOffsetTop(containerRef.current.offsetTop);
    }
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteProducts(pageSize);

  // 모든 상품을 flat하게 합치기
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data?.pages]);

  // 그리드 row 단위로 변환
  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < allProducts.length; i += columns) {
      result.push(allProducts.slice(i, i + columns));
    }
    return result;
  }, [allProducts, columns]);

  // Window Virtualizer 사용 (고정 높이 없이 브라우저 스크롤 사용)
  const virtualizer = useWindowVirtualizer({
    count: rows.length + (hasNextPage ? 1 : 0),
    estimateSize: () => 400, // 예상 row 높이
    overscan: 2, // 화면 밖 2개 row 미리 렌더링
    scrollMargin: offsetTop, // 상단 헤더/배너 높이만큼 보정
  });

  // 무한스크롤 체크
  const checkLoadMore = useCallback(() => {
    const items = virtualizer.getVirtualItems();
    const lastItem = items[items.length - 1];

    if (lastItem && lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualizer, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const throttledCheckLoadMore = useMemo(() => throttle(checkLoadMore, 100), [checkLoadMore]);

  // Window 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => throttledCheckLoadMore();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttledCheckLoadMore]);

  // 가상 아이템 목록
  const virtualItems = virtualizer.getVirtualItems();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="py-12 text-center text-red-500">데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {/* 상품 수 정보 */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>{allProducts.length}개 상품</span>
      </div>

      {/* 가상 스크롤 컨테이너 (relative) */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* 아이템들 (absolute positioned) */}
        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index >= rows.length;
          const row = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                // scrollMargin(offsetTop)을 고려하여 transform 보정
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="flex items-center justify-center py-8">
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                      더 불러오는 중...
                    </div>
                  ) : hasNextPage ? (
                    <button onClick={() => fetchNextPage()} className="btn-secondary">
                      더 보기
                    </button>
                  ) : (
                    <span className="text-text-secondary">모든 상품을 불러왔습니다</span>
                  )}
                </div>
              ) : (
                <div
                  className="grid gap-4 pb-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {row?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualProductGrid.displayName = 'VirtualProductGrid';

export default VirtualProductGrid;
