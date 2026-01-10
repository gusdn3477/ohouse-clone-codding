import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background-secondary">
            <Header />
            <main className="flex-1">
                <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
        </div>
    );
}
