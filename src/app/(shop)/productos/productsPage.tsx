"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { NoProductsResults } from "./noProductsResults";
import { PageLoader, ShowProducts } from "@/components";
import { useOrderContext } from "@/hooks";
import { TOPICS } from "@/utils";
import { ProductType } from "@/types";
import { getAvailableProducts, getProductsByCategory, getProductsBySubcategory, getProductsByTopic } from "@/services/products";

interface ProductsPageContentProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

function ProductsPageContent({ categorySlug, subcategorySlug }: ProductsPageContentProps) {
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
  const isTopic = section !== null && !isCategory && !isSubcategory;

  const page = params.get("page") ? parseInt(params.get("page")!) : 1;

  const { handleSort } = useOrderContext();

  const getProducts = useCallback(async () => {
    setProducts([]);
    setIsLoading(true);
    try {
      let productsResponse: ProductType[];
      let total = 0;

      switch (true) {
        case !!isSubcategory:
          const subcategoryResponse = await getProductsBySubcategory({
            subcategory: subcategorySlug!,
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
            category: categorySlug!,
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
  }, [categorySlug, subcategorySlug, handleSort, isCategory, isSubcategory, isTopic, page, section]);

  useEffect(() => {
    getProducts();
  }, [isCategory, isSubcategory, section, page]);

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

interface ProductsPageProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

export default function ProductsPage({ categorySlug, subcategorySlug }: ProductsPageProps) {
  return (
    <Suspense fallback={<PageLoader text='Productos' />}>
      <ProductsPageContent categorySlug={categorySlug} subcategorySlug={subcategorySlug} />
    </Suspense>
  );
}


