// Hooks para la tabla de productos
export { useBatchedChanges } from './admin-products-table/use-batched-changes'
export { useProductTableActions } from './admin-products-table/use-product-table-actions'
export { useProductTableEditing } from './admin-products-table/use-product-table-editing'
export { useProductTableSearch } from './admin-products-table/use-product-table-search'
export type { BatchedChanges, ProductChange } from './admin-products-table/use-batched-changes'

// Hooks globales
export { useAsyncData } from './use-async-data'
export { useCategoriesMenu } from './use-categories-menu'
export { useFetchData } from './use-fetch-data'
export { useMediaQuery } from './use-media-query'
export { useFiltersContext } from './use-filters-context'
export { useOrderContext } from './use-order-context'
export type { SortConfig } from './use-order-context'
export { useFetchProductsBySearch } from './use-fetch-products-by-search'
export type { SearchResultType, SearchProductsResponse } from './use-fetch-products-by-search'
export { usePagination } from './use-pagination'
export { useSearch } from './use-search'
