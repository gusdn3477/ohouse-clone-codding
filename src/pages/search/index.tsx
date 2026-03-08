import dynamic from 'next/dynamic';

const SearchPage = dynamic(() => import('@/microfrontends/search/public').then((module) => module.SearchPage), {
  loading: () => <div className="py-16 text-center text-text-secondary">검색 화면을 불러오는 중...</div>,
});

export default SearchPage;
