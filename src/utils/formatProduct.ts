import type { ProductResponseType, ProductType } from "@/types";

/**
 * Formatea un ProductResponseType a ProductType
 * Convierte los nombres de campos de la base de datos al formato esperado por el frontend
 */
export function formatProduct(p: ProductResponseType): ProductType {
  const price = p.discount_percent > 0 ? p.sell_price * (1 - p.discount_percent / 100) : p.sell_price
  const originalPrice = p.discount_percent > 0 ? p.sell_price : undefined

  return {
    id: p.product_id,
    name: p.product_name,
    provider: p.provider_name,
    purchasePrice: p.purchase_price,
    price,
    originalPrice,
    resellersPrice: p.resellers_price,
    discountPercent: p.discount_percent,
    category: p.category_name,
    subcategory: p.subcategory_name,
    inStock: p.in_stock,
    stock: p.stock,
    description: p.product_description,
    images: p.images,
    slug: p.product_slug,
    createdAt: p.created_at,
  };
}

/**
 * Formatea un array de ProductResponseType a ProductType[]
 */
export function formatProducts(products: ProductResponseType[]): ProductType[] {
  return products.map(formatProduct);
}

