import { NextPageContext } from 'next';
import Link from 'next/link';
import Head from 'next/head';

interface ErrorProps {
    statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
    return (
        <>
            <Head>
                <title>{statusCode ? `${statusCode} 에러` : '에러'} | 오늘의샵</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="min-h-[80vh] flex items-center justify-center bg-background-secondary">
                <div className="text-center px-4">
                    <div className="text-8xl mb-6">{statusCode === 500 ? '🔧' : '⚠️'}</div>
                    <h1 className="text-3xl font-bold text-text mb-4">
                        {statusCode === 500 ? '서버에 문제가 발생했습니다' : '문제가 발생했습니다'}
                    </h1>
                    <p className="text-text-secondary mb-8 max-w-md">
                        {statusCode === 500
                            ? '잠시 후 다시 시도해주세요.'
                            : `${statusCode || '알 수 없는'} 에러가 발생했습니다.`}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => window.location.reload()} className="btn-primary">
                            다시 시도
                        </button>
                        <Link href="/" legacyBehavior>
                            <a className="btn-secondary">홈으로 돌아가기</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
