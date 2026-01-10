import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - 페이지를 찾을 수 없습니다 | 오늘의샵</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="min-h-[80vh] flex items-center justify-center bg-background-secondary">
                <div className="text-center px-4">
                    <div className="text-8xl mb-6">🔍</div>
                    <h1 className="text-3xl font-bold text-text mb-4">페이지를 찾을 수 없습니다</h1>
                    <p className="text-text-secondary mb-8 max-w-md">
                        요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" legacyBehavior>
                            <a className="btn-primary">홈으로 돌아가기</a>
                        </Link>
                        <Link href="/products" legacyBehavior>
                            <a className="btn-secondary">쇼핑하러 가기</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
