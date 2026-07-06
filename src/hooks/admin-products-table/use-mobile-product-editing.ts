"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { toastContext } from "@/contexts";
import { patchProduct } from "@/services";
import type { EditableCellValue, EditableProductField, ProductType } from "@/types";
import { applyProductChange, buildPatchPayload } from "@/utils/productTableUtils";
import { useBatchedChanges, type BatchedChanges } from "./use-batched-changes";

interface UseMobileProductEditingOptions {
  products: ProductType[];
}

export function useMobileProductEditing({ products }: UseMobileProductEditingOptions) {
  const [localProducts, setLocalProducts] = useState<ProductType[]>(products);
  const committedProductsRef = useRef<ProductType[]>(products);
  const productsRef = useRef<ProductType[]>(products);
  const showToast = toastContext((state) => state.showToast);

  const handleFlush = useCallback(
    async (changes: BatchedChanges<EditableProductField>) => {
      const failedProducts: number[] = [];
      const confirmedProducts: ProductType[] = [];

      for (const [productId, fields] of Object.entries(changes)) {
        const numericProductId = Number(productId);
        const currentProduct = localProducts.find((product) => product.id === numericProductId);
        if (!currentProduct) continue;

        const payload = buildPatchPayload(currentProduct, fields);
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
    [localProducts, showToast]
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

  useEffect(() => {
    if (productsRef.current === products) return;

    productsRef.current = products;
    committedProductsRef.current = products;
    setLocalProducts(products);
    discardChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const handleDiscardChanges = useCallback(() => {
    setLocalProducts(committedProductsRef.current);
    discardChanges();
  }, [discardChanges]);

  const handleFieldChange = useCallback(
    (productId: number, field: EditableProductField, value: EditableCellValue) => {
      const product = localProducts.find((item) => item.id === productId);
      if (!product) return;

      const previousValue = product[field];
      const nextProduct = applyProductChange(product, field, value);

      setLocalProducts((current) => current.map((item) => (item.id === productId ? nextProduct : item)));
      trackChange({ productId, field, value: nextProduct[field], previousValue });
    },
    [localProducts, trackChange]
  );

  const getPendingChangesForProduct = useCallback(
    (productId: number) => {
      return pendingChanges[productId] || {};
    },
    [pendingChanges]
  );

  return {
    localProducts,
    pendingChanges,
    hasPendingChanges,
    pendingChangeCount,
    isFlushing,
    flushNow,
    handleFieldChange,
    handleDiscardChanges,
    getPendingChangesForProduct,
  };
}
