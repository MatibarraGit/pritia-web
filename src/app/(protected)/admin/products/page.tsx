"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { CustomTable, PageLoader, Pagination } from "@/components";
import { useFetchData } from "@/hooks";
import { getAllProducts } from "@/services";
import { PRODUCTS_PER_PAGE } from "@/utils";
import type { GetAllProductsResponse } from "@/services";

function ProductsPageComponent() {
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;
  const search = params.get("search") || "";

  const {
    data,
    isLoading,
    fetchData,
  } = useFetchData<GetAllProductsResponse, { page: number; search: string }>({
    fetchFunction: (args) => getAllProducts(args || { page: 1, search: "" }),
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    fetchData({ page, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-1">
        <h3 className="text-3xl font-bold text-gray-900">Productos</h3>
        <p className="text-sm text-gray-500">Gestioná tu catálogo de productos</p> 
      </div>

      <CustomTable
        key={`${page}-${search}-${products.map((product) => product.id).join("-")}`}
        products={products}
        isLoading={isLoading}
      />

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
