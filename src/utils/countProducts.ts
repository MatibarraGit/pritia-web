import { ProductType } from "@/types";

export const countProducts = (products: ProductType[], filter: keyof ProductType): Record<string, number> => {
  return products.reduce((acc, product) => {
    const key = String(product[filter] ?? 'null');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

