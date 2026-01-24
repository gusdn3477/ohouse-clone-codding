import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import Link from 'next/link';
import { ReactNode, useCallback } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center px-4 py-12">
                <div className="text-6xl mb-6">💥</div>
                <h2 className="text-2xl font-bold text-text mb-4">앗, 문제가 발생했어요</h2>
                <p className="text-text-secondary mb-2">컴포넌트를 렌더링하는 중 에러가 발생했습니다.</p>
                {process.env.NODE_ENV === 'development' && (
                    <pre className="text-xs text-accent bg-background-secondary p-4 rounded-lg mb-6 max-w-md overflow-auto text-left mx-auto">
                        {error.message}
                    </pre>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={resetErrorBoundary} className="btn-primary">
                        다시 시도
                    </button>
                    <Link href="/" legacyBehavior>
                        <a className="btn-secondary">홈으로</a>
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
    const handleReset = useCallback(() => { }, []);

    return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError} onReset={handleReset}>
            {children}
        </ReactErrorBoundary>
    );
}

export { ReactErrorBoundary, ErrorFallback };
