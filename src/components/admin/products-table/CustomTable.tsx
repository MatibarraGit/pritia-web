"use client";

import { useCallback } from "react";
import { Loader2 } from "lucide-react";

import {
  MobileProductRow,
  MyLoader,
  ProductsBulkActionDialog,
  ProductsDesktopTable,
  ProductsPendingChangesBanner,
  ProductsTableToolbar,
  SelectionMenu,
} from "@/components";
import {
  useProductTableActions,
  useProductTableEditing,
  useAsyncData,
  useProductTableSearch,
  useOrderContext,
  useFiltersContext,
} from "@/hooks";
import { toastContext } from "@/contexts";
import type { ProductType } from "@/types";
import { EMPTY_PRODUCT_TABLE_OPTIONS, fetchProductTableOptions, PRODUCT_TABLE_SORT_CONFIG } from "@/utils";

interface CustomTableProps {
  products: ProductType[];
  isLoading: boolean;
}

export function CustomTable({ products, isLoading }: CustomTableProps) {
  const { search, handleSearch, clearSearch } = useProductTableSearch();
  const { adminFilters, filterItems } = useFiltersContext();
  const clientSearch = typeof adminFilters.productsClientSearch === "string" ? adminFilters.productsClientSearch : "";
  const showToast = toastContext((state) => state.showToast);
  const fetchOptions = useCallback(async () => {
    try {
      return await fetchProductTableOptions();
    } catch (error) {
      showToast("Error al cargar opciones de edición", "error");
      throw error;
    }
  }, [showToast]);

  const { data: options, isLoading: isLoadingOptions } = useAsyncData({
    cacheKey: "product-table-options",
    fetchFunction: fetchOptions,
    initialData: EMPTY_PRODUCT_TABLE_OPTIONS,
  });

  // Lógica de edición in-line
  const {
    localProducts,
    isEditMode,
    activeCell,
    pendingChanges,
    hasPendingChanges,
    pendingChangeCount,
    isFlushing,
    isBulkDeletingProducts,
    flushNow,
    activateCell,
    cancelCell,
    setIsBulkProcessingProducts,
    handleCellChange,
    handleDiscardChanges,
    handleBulkDeleteProducts,
    handleToggleEditMode,
    handleToggleSelecting,
  } = useProductTableEditing({ products, options });

  // Lógica de ordenamiento
  const filteredProducts = filterItems(localProducts);
  const { orderItems } = useOrderContext("admin-products-table");
  const sortedProducts = orderItems(filteredProducts, PRODUCT_TABLE_SORT_CONFIG) || [];

  // Lógica de acciones
  const {
    opened,
    actionType,
    modalTitle,
    openModal,
    closeModal,
    handleAction,
  } = useProductTableActions();

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <ProductsBulkActionDialog
        open={opened && !isBulkDeletingProducts}
        actionType={actionType}
        title={modalTitle}
        openModal={openModal}
        closeModal={closeModal}
        onBulkDeleteProducts={handleBulkDeleteProducts}
        setIsBulkProcessingProducts={setIsBulkProcessingProducts}
      />

      {isBulkDeletingProducts && (
        <div
          className="fixed bottom-22 right-22 z-60 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
          role="status"
          aria-label="Eliminando productos"
        >
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      )}

      <SelectionMenu
        products={sortedProducts}
        handleAction={handleAction}
        customToggleSelecting={handleToggleSelecting}
        allowBulkDelete
      />

      <ProductsTableToolbar
        search={search}
        clientSearch={clientSearch}
        isEditMode={isEditMode}
        hasPendingChanges={hasPendingChanges}
        isFlushing={isFlushing}
        isLoadingOptions={isLoadingOptions}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        onDiscardChanges={handleDiscardChanges}
        onFlushNow={flushNow}
        onToggleEditMode={handleToggleEditMode}
      />

      {hasPendingChanges && <ProductsPendingChangesBanner pendingChangeCount={pendingChangeCount} />}

      <div className="relative min-h-[50dvh]" aria-busy={isLoading}>
        {isLoading && (
          <MyLoader className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-white/70" />
        )}

        {sortedProducts.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No hay productos para mostrar.</p>
        ) : (
          <>
            <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-200 lg:hidden">
              {sortedProducts.map((product) => (
                <MobileProductRow key={product.id} product={product} />
              ))}
            </div>

            <ProductsDesktopTable
              products={sortedProducts}
              options={options}
              pendingChanges={pendingChanges}
              activeCell={activeCell}
              isEditMode={isEditMode}
              onActivateCell={activateCell}
              onCancelCell={cancelCell}
              onCellChange={handleCellChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
