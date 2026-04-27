import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background-secondary">
      <div className="px-4 text-center">
        <div className="mb-6 text-8xl">🔍</div>
        <h1 className="mb-4 text-4xl font-bold text-text">페이지를 찾을 수 없습니다</h1>
        <p className="mb-8 max-w-md text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary">
            홈으로 돌아가기
          </Link>
          <Link href="/products" className="btn-secondary">
            상품 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
