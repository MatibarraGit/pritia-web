"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PageLoader, MobileProductPanel, Pagination, ProductsTableToolbar } from "@/components";
import { useFetchData, useFiltersContext, useProductTableSearch } from "@/hooks";
import { getAllProducts } from "@/services";
import type { GetAllProductsParams, GetAllProductsResponse } from "@/services";
import { PRODUCTS_PER_PAGE } from "@/utils";

function MobilePanelComponent() {
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;

  const { search } = useProductTableSearch();
  const { adminFilters, filterItems } = useFiltersContext();
  const clientSearch = typeof adminFilters.productsClientSearch === "string" ? adminFilters.productsClientSearch : "";

  const {
    data,
    isLoading: isLoadingProducts,
    fetchData,
  } = useFetchData<GetAllProductsResponse, GetAllProductsParams>({
    fetchFunction: () => getAllProducts({ page, search }),
    initialFetch: false,
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Lógica de filtrado
  const filteredProducts = filterItems(products);

  useEffect(() => {
    fetchData({ page, search });
  }, [fetchData, page, search]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-3xl font-bold text-gray-900">Panel Mobile</h3>
        <p className="text-sm text-gray-500">Edita tus productos desde el celular</p>
      </div>

      {isLoadingProducts ? (
        <PageLoader />
      ) : (
        <>
          <ProductsTableToolbar 
            search={search}
            clientSearch={clientSearch}
            isEditMode={false}
            hasPendingChanges={false}
            isFlushing={false}
            isLoadingOptions={false}
            onSearch={() => {}}
            onClearSearch={() => {}}
            onDiscardChanges={() => {}}
            onFlushNow={() => {}}
            onToggleEditMode={() => {}}
          />
          <MobileProductPanel products={filteredProducts}/>
          <Pagination totalPages={totalPages} className="my-5" />
        </>
      )}
    </>
  );
}

export default function MobilePanelPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MobilePanelComponent />
    </Suspense>
  );
}
