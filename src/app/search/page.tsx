import type { Metadata } from 'next';
import SearchPage from '@/components/features/search/SearchPage';

export const metadata: Metadata = {
  title: '검색',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchRoutePage() {
  return <SearchPage />;
}
