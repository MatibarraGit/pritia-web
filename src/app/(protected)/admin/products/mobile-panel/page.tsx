"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PageLoader } from "@/components";
import { MobileProductPanel } from "@/components/admin/mobile-panel/MobileProductPanel";
import { useAsyncData, useFetchData } from "@/hooks";
import { useMobileProductEditing } from "@/hooks/admin-products-table/use-mobile-product-editing";
import { getAllProducts } from "@/services";
import { EMPTY_PRODUCT_TABLE_OPTIONS, fetchProductTableOptions } from "@/utils";
import type { GetAllProductsParams, GetAllProductsResponse } from "@/services";

function MobilePanelComponent() {
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page")!) : 1;
  const search = params.get("search") || "";

  const fetchOptions = useCallback(async () => {
    try {
      return await fetchProductTableOptions();
    } catch (error) {
      console.error("Error al cargar opciones de edición", error);
      return EMPTY_PRODUCT_TABLE_OPTIONS;
    }
  }, []);

  const {
    data,
    isLoading: isLoadingProducts,
    fetchData,
  } = useFetchData<GetAllProductsResponse, GetAllProductsParams>({
    fetchFunction: () => getAllProducts({ page, search }),
    initialFetch: false,
  });

  const products = data?.products || [];

  useEffect(() => {
    fetchData({ page, search });
  }, [fetchData, page, search]);

  const { data: options, isLoading: isLoadingOptions } = useAsyncData({
    cacheKey: "mobile-panel-options",
    fetchFunction: fetchOptions,
    initialData: EMPTY_PRODUCT_TABLE_OPTIONS,
  });

  const {
    localProducts,
    pendingChanges,
    hasPendingChanges,
    pendingChangeCount,
    isFlushing,
    flushNow,
    handleFieldChange,
    handleDiscardChanges,
  } = useMobileProductEditing({ products, options: options || EMPTY_PRODUCT_TABLE_OPTIONS });

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-3xl font-bold text-gray-900">Panel Móvil</h3>
        <p className="text-sm text-gray-500">Edita tus productos desde el celular</p>
      </div>

      {isLoadingProducts || isLoadingOptions ? (
        <PageLoader />
      ) : (
        <MobileProductPanel
          products={localProducts}
          pendingChanges={pendingChanges}
          hasPendingChanges={hasPendingChanges}
          pendingChangeCount={pendingChangeCount}
          isFlushing={isFlushing}
          onFieldChange={handleFieldChange}
          onFlushNow={flushNow}
          onDiscardChanges={handleDiscardChanges}
        />
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
