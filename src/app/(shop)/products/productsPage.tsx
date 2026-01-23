"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { NoProductsResults } from "./noProductsResults";
import { PageLoader, ShowProducts } from "@/components";
import { useFiltersContext, useOrderContext } from "@/hooks";
import { TOPICS } from "@/utils";
import { ProductType } from "@/types";
import { getAvailableProducts, getProductsByCategory, getProductsBySubcategory, getProductsByTopic } from "@/services/products";

function ProductsPageContent() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const title = useRef<string>('');

  const params = useSearchParams();
  const category = params.get("category");
  const subcategory = params.get("subcategory");
  const topic = params.get("topic");

  const isCategory = category !== null;
  const isTopic = topic !== null;

  const page = params.get("page") ? parseInt(params.get("page")!) : 1;

  const { handleFilterChange, resetFilters } = useFiltersContext();
  const { handleSort } = useOrderContext();

  async function getProducts() {
    setProducts([]);
    setIsLoading(true);
    try {
      let productsResponse: ProductType[];
      let total = 0;

      switch (true) {
        case !!subcategory:
          const subcategoryResponse = await getProductsBySubcategory({
            subcategory: subcategory!,
            page
          });
          productsResponse = subcategoryResponse.products;
          total = subcategoryResponse.total;
          title.current = subcategory!;
          break;
          
        case !!isCategory:
          const categoryResponse = await getProductsByCategory({
            category: category!,
            page
          });
          productsResponse = categoryResponse.products;
          total = categoryResponse.total;
          title.current = category!;
          break;

        case !!isTopic:
          const topicResponse = await getProductsByTopic({
            topic: topic!,
            page
          });
          productsResponse = topicResponse.products;
          total = topicResponse.total;
          title.current = topic!;

          if (topic === TOPICS.BEST_SELLERS) {
            handleSort('totalQuantitySold', 'desc');
          }
          break;

        default:
          const availableResponse = await getAvailableProducts({ page });
          productsResponse = availableResponse.products;
          total = availableResponse.total;
          title.current = 'Todos los Productos';
      }

      setProducts(productsResponse || []);
      setTotalProducts(total);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProducts();

    // TODO: Devolver desde el backend únicamente los productos que pertenecen a la subcategoría para no tener que usar los filtros del frontend para filtrar
    if (subcategory !== null) {
      handleFilterChange("subcategory", subcategory);
      return () => {
        resetFilters();
      };
    }
  }, [category, subcategory, topic, page]);

  if (isLoading) return <PageLoader text='Productos' />;
  if (products.length === 0) return <NoProductsResults category={subcategory || category || undefined} />;

  return (
    <ShowProducts
      products={products}
      totalProducts={totalProducts}
      search={title.current}
      breadcumbs={isCategory}
      subcategory={subcategory || undefined}
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader text='Productos' />}>
      <ProductsPageContent />
    </Suspense>
  );
}


