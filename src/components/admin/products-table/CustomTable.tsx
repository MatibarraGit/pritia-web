"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { 
  MobileProductRow, 
  ProductsDesktopTable,
  ProductsTableToolbar,
  SelectionMenu,
  TableLoader
} from "@/components";
import { selectItemsContext, toastContext } from "@/contexts";
import { useBatchedChanges, type BatchedChanges } from "@/hooks";
import { patchProduct } from "@/services";
import type { EditableCellValue, EditableProductField, OptionsCache, ProductColumnKey, ProductType } from "@/types";
import { applyProductChange, buildPatchPayload, fetchProductTableOptions } from "@/utils";

interface CustomTableProps {
  products: ProductType[];
  isLoading: boolean;
}

export function CustomTable({ products, isLoading }: CustomTableProps) {
  const [localProducts, setLocalProducts] = useState<ProductType[]>(products);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCell, setActiveCell] = useState<{ productId: number; field: ProductColumnKey } | null>(null);
  const [sortColumn, setSortColumn] = useState<ProductColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [options, setOptions] = useState<OptionsCache>({ providers: [], categories: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const committedProductsRef = useRef<ProductType[]>(products);

  // Contexto de selección de items
  const { isSelecting, toggleSelecting } = selectItemsContext(); 

  // Función para cambiar el estado de isSelecting a la vez que cambia el estado de isEditMode
  function handleToggleSelecting() {
    if (!!isEditMode) {
      setIsEditMode(false);
      toggleSelecting();
    } else {
      toggleSelecting();
    }
  }

  // Función para compartir y eliminar productos desde la modal
  // const handleAction = (action: string, item: ProductType | null = null) => {
  //   switch (action) {
  //     case ACTION_TYPES.DELETE:
  //       if (item) {
  //       }
  //       break

  //     default:
  //       setActionType(action);
  //       setOpened(true);
  //       break
  //   }
  // };

  // async function handleConfirmDeleteProducts() {    
  //   const result = await confirmAction({ 
  //     actionType: actionType,
  //     productToAction: productToAction, 
  //     handleProductAction: productAction, 
  //     args: productToAction.id,
  //     close: () => setOpened(false)
  //   });

  //   if(result.errorMessage) return;
    
  //   if (data) {
  //     setData({ 
  //       products: products.filter((product) => product.id !== productToAction.id), 
  //       total: totalProducts - 1 
  //     });
  //   }
  // }

  // Declaración de funciones y variables para la tabla
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const search = params.get("search") || "";
  const showToast = toastContext((state) => state.showToast);

  useEffect(() => {
    let isMounted = true;

    fetchProductTableOptions()
      .then((cachedOptions) => {
        if (isMounted) setOptions(cachedOptions);
      })
      .catch(() => {
        if (isMounted) showToast("Error al cargar opciones de edición", "error");
      })
      .finally(() => {
        if (isMounted) setIsLoadingOptions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleFlush = useCallback(
    async (changes: BatchedChanges<EditableProductField>) => {
      const failedProducts: number[] = [];
      const confirmedProducts: ProductType[] = [];

      for (const [productId, fields] of Object.entries(changes)) {
        const currentProduct = localProducts.find((product) => product.id === Number(productId));
        if (!currentProduct) continue;

        const payload = buildPatchPayload(currentProduct, fields, options);
        const result = await patchProduct(Number(productId), payload);

        if (result.errorMessage || !result.product) {
          failedProducts.push(Number(productId));
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

  const handleDiscardChanges = () => {
    setLocalProducts(committedProductsRef.current);
    setActiveCell(null);
    discardChanges();
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = String(formData.get("search") || "");
    params.set("page", "1");

    if (searchValue) params.set("search", searchValue);
    else params.delete("search");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    params.delete("search");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = (column: ProductColumnKey) => {
    if (sortColumn === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCellChange = (productId: number, field: EditableProductField, value: EditableCellValue) => {
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
  };

  const sortedProducts = useMemo(() => {
    if (!sortColumn) return localProducts;

    return [...localProducts].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue ?? "").localeCompare(String(bValue ?? ""))
        : String(bValue ?? "").localeCompare(String(aValue ?? ""));
    });
  }, [localProducts, sortColumn, sortDirection]);

  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <SelectionMenu 
        products={products} 
        handleAction={() => {}}
        customToggleSelecting={handleToggleSelecting}  
      />

      <ProductsTableToolbar
        search={search}
        isEditMode={isEditMode}
        hasPendingChanges={hasPendingChanges}
        isFlushing={isFlushing}
        isLoadingOptions={isLoadingOptions}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        onDiscardChanges={handleDiscardChanges}
        onFlushNow={flushNow}
        onToggleEditMode={() => {
          setIsEditMode((current) => {
            if (current) {
              return false;
            } else {
              toggleSelecting(false)
              return true;
            }
          });
          setActiveCell(null);
        }}
      />

      {hasPendingChanges && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {pendingChangeCount} cambio{pendingChangeCount !== 1 ? "s" : ""} pendiente{pendingChangeCount !== 1 ? "s" : ""}
        </div>
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
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onActivateCell={(productId, field) => setActiveCell({ productId, field })}
            onCancelCell={() => setActiveCell(null)}
            onCellChange={handleCellChange}
          />
        </>
      )}
    </section>
  );
}
