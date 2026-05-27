// API Client
export { apiRequest } from "./api-client";

// Categories
export { fetchAllCategories } from "./categories";

// Products
export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAvailableProducts,
  getHomeProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductsByTopic,
  patchProduct,
  searchProducts,
  updateProduct,
} from "./products";
export type {
  GetAllProductsParams,
  GetAllProductsResponse,
  GetProductsByCategoryParams,
  GetProductsBySubcategoryParams,
  GetProductsByTopicParams,
  SearchProductsParams,
  SearchProductsResponse,
} from "./products";

// Providers
export { fetchAllProviders } from "./providers";
