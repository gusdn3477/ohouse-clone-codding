'use client';

import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import Link from 'next/link';
import { ReactNode, useCallback } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="px-4 py-12 text-center">
        <div className="mb-6 text-6xl">💥</div>
        <h2 className="mb-4 text-2xl font-bold text-text">앗, 문제가 발생했어요</h2>
        <p className="mb-2 text-text-secondary">컴포넌트를 렌더링하는 중 에러가 발생했습니다.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mx-auto mb-6 max-w-md overflow-auto rounded-lg bg-background-secondary p-4 text-left text-xs text-accent">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button onClick={resetErrorBoundary} className="btn-primary">
            다시 시도
          </button>
          <Link href="/" className="btn-secondary">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

function logError(error: Error, info: { componentStack?: string | null }) {
  console.error('ErrorBoundary caught an error:', error);
  console.error('Component Stack:', info.componentStack);
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleReset = useCallback(() => {}, []);

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError} onReset={handleReset}>
      {children}
    </ReactErrorBoundary>
  );
}

export { ReactErrorBoundary, ErrorFallback };
