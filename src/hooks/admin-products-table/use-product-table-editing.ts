"use client";

import { useCallback, useRef, useState } from "react";

import { selectItemsContext, toastContext } from "@/contexts";
import { bulkDeleteProducts, patchProduct } from "@/services";
import type { EditableCellValue, EditableProductField, OptionsCache, ProductColumnKey, ProductType } from "@/types";
import { applyProductChange, buildPatchPayload } from "@/utils/productTableUtils";
import { useBatchedChanges, type BatchedChanges } from "./use-batched-changes";

interface UseProductTableEditingOptions {
  products: ProductType[];
  options: OptionsCache;
}

export function useProductTableEditing({ products, options }: UseProductTableEditingOptions) {
  const [localProducts, setLocalProducts] = useState<ProductType[]>(products);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCell, setActiveCell] = useState<{ productId: number; field: ProductColumnKey } | null>(null);
  const [isBulkDeletingProducts, setIsBulkProcessingProducts] = useState(false);
  const committedProductsRef = useRef<ProductType[]>(products);
  const toggleSelecting = selectItemsContext((state) => state.toggleSelecting);
  const showToast = toastContext((state) => state.showToast);

  const handleFlush = useCallback(
    async (changes: BatchedChanges<EditableProductField>) => {
      const failedProducts: number[] = [];
      const confirmedProducts: ProductType[] = [];

      for (const [productId, fields] of Object.entries(changes)) {
        const numericProductId = Number(productId);
        const currentProduct = localProducts.find((product) => product.id === numericProductId);
        if (!currentProduct) continue;

        const payload = buildPatchPayload(currentProduct, fields, options);
        const result = await patchProduct(numericProductId, payload);

        if (result.errorMessage || !result.product) {
          failedProducts.push(numericProductId);
        } else {
          confirmedProducts.push(result.product);
        }
      }

      if (confirmedProducts.length > 0) {
        setLocalProducts((current) =>
          current.map((product) => confirmedProducts.find((confirmed) => confirmed.id === product.id) || product)
        );
        committedProductsRef.current = committedProductsRef.current.map(
          (product) => confirmedProducts.find((confirmed) => confirmed.id === product.id) || product
        );
      }

      if (failedProducts.length > 0) {
        showToast(`No se pudieron guardar ${failedProducts.length} producto(s)`, "error");
        throw new Error("Error al guardar cambios parciales");
      }

      showToast("Cambios guardados", "success");
    },
    [localProducts, options, showToast]
  );

  const {
    pendingChanges,
    hasPendingChanges,
    pendingChangeCount,
    isFlushing,
    trackChange,
    discardChanges,
    flushNow,
  } = useBatchedChanges<EditableProductField>({
    onFlush: handleFlush,
  });

  const handleBulkDeleteProducts = useCallback(
    async (productIds: number[]) => {
      const uniqueProductIds = [...new Set(productIds)];
      if (uniqueProductIds.length === 0) {
        showToast("No hay productos seleccionados", "error");
        return;
      }

      const previousLocalProducts = localProducts;
      const previousCommittedProducts = committedProductsRef.current;

      setIsBulkProcessingProducts(true);
      setLocalProducts((current) => current.filter((product) => !uniqueProductIds.includes(product.id)));
      committedProductsRef.current = committedProductsRef.current.filter(
        (product) => !uniqueProductIds.includes(product.id)
      );

      try {
        const result = await bulkDeleteProducts(uniqueProductIds);

        if (result.errorMessage) {
          throw new Error(result.errorMessage);
        }

        const deletedProductIds = result.deletedProductIds || uniqueProductIds;
        deletedProductIds.forEach((productId) => discardChanges(productId));
        showToast(result.successMessage || `${deletedProductIds.length} producto(s) eliminado(s)`, "success");
        toggleSelecting(false);
      } catch (error) {
        const deletionError = error instanceof Error
          ? error
          : new Error("Error desconocido al eliminar los productos");

        setLocalProducts(previousLocalProducts);
        committedProductsRef.current = previousCommittedProducts;
        showToast(deletionError.message, "error");
        throw deletionError;
      } finally {
        setIsBulkProcessingProducts(false);
      }
    },
    [discardChanges, localProducts, showToast, toggleSelecting]
  );

  const handleDiscardChanges = useCallback(() => {
    setLocalProducts(committedProductsRef.current);
    setActiveCell(null);
    discardChanges();
  }, [discardChanges]);

  const handleToggleSelecting = useCallback(() => {
    if (isEditMode) setIsEditMode(false);
    toggleSelecting();
  }, [isEditMode, toggleSelecting]);

  const handleToggleEditMode = useCallback(() => {
    if (!isEditMode) toggleSelecting(false);
    setIsEditMode((current) => !current);
    setActiveCell(null);
  }, [isEditMode, toggleSelecting]);

  const activateCell = useCallback((productId: number, field: ProductColumnKey) => {
    setActiveCell({ productId, field });
  }, []);

  const cancelCell = useCallback(() => {
    setActiveCell(null);
  }, []);

  const handleCellChange = useCallback(
    (productId: number, field: EditableProductField, value: EditableCellValue) => {
      const product = localProducts.find((item) => item.id === productId);
      if (!product) return;

      const previousValue = product[field];
      const nextProduct = applyProductChange(product, field, value, options);

      setLocalProducts((current) => current.map((item) => (item.id === productId ? nextProduct : item)));
      trackChange({ productId, field, value: nextProduct[field], previousValue });

      if (field === "category" && nextProduct.subcategory !== product.subcategory) {
        trackChange({
          productId,
          field: "subcategory",
          value: nextProduct.subcategory,
          previousValue: product.subcategory,
        });
      }
    },
    [localProducts, options, trackChange]
  );

  return {
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
  };
}
