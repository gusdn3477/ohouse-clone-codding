'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background-secondary">
      <div className="px-4 text-center">
        <div className="mb-6 text-8xl">⚠️</div>
        <h1 className="mb-4 text-3xl font-bold text-text">문제가 발생했습니다</h1>
        <p className="mb-8 max-w-md text-text-secondary">잠시 후 다시 시도해주세요.</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary">
            다시 시도
          </button>
          <Link href="/" className="btn-secondary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
