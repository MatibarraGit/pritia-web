"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Boxes, List } from "lucide-react";

import { CustomTable, PageLoader, Pagination } from "@/components";
import { Button } from "@/components/ui";
import { useFetchData } from "@/hooks";
import { getAllProducts, getInventoryProducts } from "@/services";
import { PRODUCTS_PER_PAGE } from "@/utils";
import type { GetAllProductsParams, GetAllProductsResponse } from "@/services";

function ProductsPageComponent() {
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;
  const search = params.get("search") || "";
  const isInventoryView = params.get("view") === "inventory";
  const productsModeHref = isInventoryView
    ? "/admin/products?page=1"
    : "/admin/products?view=inventory&page=1";

  const fetchProducts = useCallback(
    (args?: GetAllProductsParams) => {
      const fetchParams = args || { page: 1, search: "" };
      return isInventoryView ? getInventoryProducts(fetchParams) : getAllProducts(fetchParams);
    },
    [isInventoryView]
  );

  const {
    data,
    isLoading,
    fetchData,
  } = useFetchData<GetAllProductsResponse, GetAllProductsParams>({
    fetchFunction: fetchProducts,
    initialFetch: false,
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    fetchData({ page, search });
  }, [fetchData, isInventoryView, page, search]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-bold text-gray-900">Productos</h3>
          <p className="text-sm text-gray-500">Gestiona tu catalogo de productos</p>
        </div>

        <Button href={productsModeHref} variant="outline" size="sm" className="w-fit">
          {isInventoryView ? <List size={16} /> : <Boxes size={16} />}
          {isInventoryView ? "Ir a Todos los Productos" : "Ir a Inventario"}
        </Button>
      </div>

      <CustomTable products={products} isLoading={isLoading} />

      <Pagination totalPages={totalPages} className="my-5" />
      <h4 className="text-center">
        {isLoading !== true && totalProducts} Productos
      </h4>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsPageComponent />
    </Suspense>
  );
}
