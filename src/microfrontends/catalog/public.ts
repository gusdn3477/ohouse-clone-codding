export { default as HomeCatalogWidgets } from './components/HomeCatalogWidgets';
export { default as CatalogDetailPage } from './pages/CatalogDetailPage';
export { default as CatalogListPage } from './pages/CatalogListPage';
export type { CatalogDetailPageProps } from './pages/CatalogDetailPage';
export type { CatalogListPageProps } from './pages/CatalogListPage';
export {
  catalogQueryKeys,
} from './api/queryKeys';
export {
  fetchAllProducts,
  fetchCategories,
  fetchFeaturedProducts,
  fetchProduct,
  fetchProductsByCategory,
  fetchProductsPaginated,
  getCatalogDetailStaticPaths,
  searchProducts,
} from './api/services';
export {
  prefetchCatalogDetail,
  prefetchCatalogList,
  prefetchCategories,
  prefetchHomeCatalogPreview,
  prefetchInfiniteProducts,
  prefetchProduct,
  prefetchProductsByCategory,
  useCategories,
  useFeaturedProducts,
  useInfiniteProducts,
  useProduct,
  useProductsByCategory,
  useSearchProducts,
} from './api/hooks';
