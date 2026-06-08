// API Client
export { apiRequest } from "./api-client";

// Categories
export { fetchAllCategories } from "./categories";

// Images
export { deleteProductImages } from "./images"

// Products
export {
  bulkDeleteProducts,
  createProduct,
  getAllProducts,
  getAvailableProducts,
  getHomeProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductsByTopic,
  patchProduct,
  searchProducts,
  updateProduct
} from "./products";
export type {
  GetAllProductsParams,
  GetAllProductsResponse,
  GetProductsByCategoryParams,
  GetProductsBySubcategoryParams,
  GetProductsByTopicParams,
  SearchProductsParams,
  SearchProductsResponse,
  BulkDeleteProductsResponse,
} from "./products";

// Providers
export { fetchAllProviders } from "./providers";
