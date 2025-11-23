"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { NoProductsResults } from "./noProductsResults";
import { PageLoader, ShowProducts } from "@/components";
import { useFiltersContext, useOrderContext } from "@/hooks";
import { TOPICS } from "@/utils";
import { ProductType } from "@/types";

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
        case !!isCategory:
          const categoryResponse = await fetch(
            `/api/products/byCategory/${encodeURIComponent(category!)}?page=${page}`
          );
          productsResponse = await categoryResponse.json();
          // TODO: Obtener total de productos desde el backend
          total = productsResponse.length;
          title.current = category!;
          break;

        case !!isTopic:
          const topicResponse = await fetch(
            `/api/products/byTopic/${encodeURIComponent(topic!)}?page=${page}`
          );
          productsResponse = await topicResponse.json();
          // TODO: Obtener total de productos desde el backend
          total = productsResponse.length;
          title.current = topic!;

          if (topic === TOPICS.BEST_SELLERS) {
            handleSort('totalQuantitySold', 'desc');
          }
          break;

        default:
          const availableResponse = await fetch(`/api/products/available?page=${page}`);
          productsResponse = await availableResponse.json();
          // TODO: Obtener total de productos desde el backend
          total = productsResponse.length;
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
  if (products.length === 0) return <NoProductsResults category={category || undefined} />;

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

