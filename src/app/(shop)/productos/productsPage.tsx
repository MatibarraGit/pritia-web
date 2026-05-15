"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { NoProductsResults } from "./noProductsResults";
import { PageLoader, ShowProducts } from "@/components";
import { useOrderContext } from "@/hooks";
import { TOPICS } from "@/utils";
import { ProductType } from "@/types";
import { getAvailableProducts, getProductsByCategory, getProductsBySubcategory, getProductsByTopic } from "@/services/products";

// TODO: Eliminar lógica de hotsale al finalizar HotSale

interface ProductsPageProps {
  categorySlug?: string;
  subcategorySlug?: string;
  isHotSale?: boolean;
}

function ProductsPageContent({ categorySlug, subcategorySlug, isHotSale }: ProductsPageProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const title = useRef<string>("");
  const currentCategory = useRef<string>("");
  const currentSubcategory = useRef<string>("");

  const params = useSearchParams();
  const section = params.get("seccion");

  const isCategory = typeof categorySlug === "string" && categorySlug.length > 0;
  const isSubcategory = typeof subcategorySlug === "string" && subcategorySlug.length > 0;
  const isTopic = section !== null && !isCategory && !isSubcategory && !isHotSale;

  const page = params.get("page") ? parseInt(params.get("page")!) : 1;

  const { handleSort } = useOrderContext();

  const getProducts = useCallback(async () => {
    setProducts([]);
    setIsLoading(true);
    try {
      let productsResponse: ProductType[];
      let total = 0;

      switch (true) {
        case !!isHotSale:
          const offersResponse = await getProductsByTopic({ page, section: TOPICS.OFFERS });
          productsResponse = offersResponse.products;
          total = offersResponse.total;
          title.current = "Hot Sale 2026";
          currentCategory.current = "";
          currentSubcategory.current = "";
          break;

        case !!isSubcategory:
          const subcategoryResponse = await getProductsBySubcategory({
            subcategorySlug,
            page,
          });
          productsResponse = subcategoryResponse.products;
          total = subcategoryResponse.total;
          currentCategory.current = productsResponse[0]?.category ?? "";
          currentSubcategory.current = productsResponse[0]?.subcategory ?? "";
          title.current = currentSubcategory.current
          break;
          
        case !!isCategory:
          const categoryResponse = await getProductsByCategory({
            categorySlug,
            page,
          });
          productsResponse = categoryResponse.products;
          total = categoryResponse.total;
          currentCategory.current = productsResponse[0]?.category ?? categorySlug ?? "";
          currentSubcategory.current = "";
          title.current = currentCategory.current
          break;

        case !!isTopic:
          const topicResponse = await getProductsByTopic({
            section: section!,
            page
          });
          productsResponse = topicResponse.products;
          total = topicResponse.total;
          title.current = section!;
          currentCategory.current = "";
          currentSubcategory.current = "";

          if (section === TOPICS.BEST_SELLERS) {
            handleSort('totalQuantitySold', 'desc');
          }
          break;

        default:
          const availableResponse = await getAvailableProducts({ page });
          productsResponse = availableResponse.products;
          total = availableResponse.total;
          title.current = "Todos los Productos";
          currentCategory.current = "";
          currentSubcategory.current = "";
          break;
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
  }, [categorySlug, subcategorySlug, handleSort, isCategory, isSubcategory, isTopic, page, section, isHotSale]);

  useEffect(() => {
    getProducts();
  }, [isCategory, isSubcategory, section, page, isHotSale]);

  if (isLoading) return <PageLoader text='Productos' />;
  if (products.length === 0) return <NoProductsResults category={title.current || undefined} />;

  return (
    <ShowProducts
      products={products}
      totalProducts={totalProducts}
      search={title.current}
      category={currentCategory.current}
      subcategory={currentSubcategory.current} 
    />
  );
}

export default function ProductsPage({ categorySlug, subcategorySlug, isHotSale }: ProductsPageProps) {
  return (
    <Suspense fallback={<PageLoader text='Productos' />}>
      <ProductsPageContent categorySlug={categorySlug} subcategorySlug={subcategorySlug} isHotSale={isHotSale} />
    </Suspense>
  );
}


