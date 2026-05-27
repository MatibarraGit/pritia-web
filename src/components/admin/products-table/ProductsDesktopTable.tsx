import { ChevronDown, ChevronUp } from "lucide-react";

import { ProductTableCell } from "@/components";
import { selectItemsContext } from "@/contexts";
import { cn } from "@/libs/utils";
import type { EditableCellValue, EditableProductField, OptionsCache, ProductColumnKey, ProductType } from "@/types";
import { COLUMNS } from "@/utils";

interface ProductsDesktopTableProps {
  products: ProductType[];
  options: OptionsCache;
  pendingChanges: Partial<Record<number, Partial<Record<EditableProductField, unknown>>>>;
  activeCell: { productId: number; field: ProductColumnKey } | null;
  isEditMode: boolean;
  sortColumn: ProductColumnKey | null;
  sortDirection: "asc" | "desc";
  onSort: (column: ProductColumnKey) => void;
  onActivateCell: (productId: number, field: ProductColumnKey) => void;
  onCancelCell: () => void;
  onCellChange: (productId: number, field: EditableProductField, value: EditableCellValue) => void;
}

export function ProductsDesktopTable({
  products,
  options,
  pendingChanges,
  activeCell,
  isEditMode,
  sortColumn,
  sortDirection,
  onSort,
  onActivateCell,
  onCancelCell,
  onCellChange,
}: ProductsDesktopTableProps) {
  const { isSelecting, selectedIds, toggleItemSelection } = selectItemsContext(); 

  // Función para seleccionar/deseleccionar un item 
  const handleClickItem = (product: ProductType) => {
    if (!isSelecting) return;
    const images = (product.images as string[] | undefined) || [];
    // const image = images.length > 0 ? images[0] : '';
    const name = (product.name as string | undefined) || '';
    const description = (product.description as string | undefined) || '';
    const sellPrice = Number(product.price) || 0;
    const resellersPrice = Number(product.resellersPrice) || 0;
    
    toggleItemSelection({
      id: Number(product.id),
      name,
      images,
      description,
      sellPrice,
      resellersPrice,
      originalPrice: Number(product.originalPrice) || null,
    });
  }

  return (
    <div className="hidden max-h-[70dvh] overflow-auto rounded-lg border border-gray-200 lg:block">
      <div
        className="grid min-w-max"
        style={{ gridTemplateColumns: COLUMNS.map((column) => column.width).join(" ") }}
      >
        <div className="contents">
          {COLUMNS.map((column) => (
            <button
              type="button"
              key={column.key}
              onClick={() => column.type !== "image" && onSort(column.key)}
              className={cn(
                "sticky top-0 z-10 flex min-w-0 items-center justify-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-3 text-center text-xs font-semibold uppercase text-gray-600",
                column.key === "images" && "sticky left-0 z-50",
                column.key === "name" && "sticky left-40 z-50 shadow-[6px_0_12px_-10px_rgba(0,0,0,0.25)]",
                column.type !== "text" && "transition hover:bg-gray-100"
              )}
            >
              {column.label}
              {sortColumn === column.key && (
                sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
          ))}
        </div>

        {products.map((product) =>
          COLUMNS.map((column) => {
            const isModified = pendingChanges[product.id]?.[column.key as EditableProductField] !== undefined;
            const isActive = activeCell?.productId === product.id && activeCell.field === column.key;

            return (
              <div
                key={`${product.id}-${column.key}`}
                className={cn(
                  "flex min-h-20 min-w-0 items-center justify-center border-b border-gray-100 bg-white px-2 py-2 text-center text-sm transition group-hover:bg-gray-50",
                  column.key === "images" && "sticky left-0 z-20 [&:has([data-images-expanded='true'])]:z-40",
                  column.key === "name" && "sticky left-40 z-20 shadow-[6px_0_12px_-10px_rgba(0,0,0,0.25)]",
                  column.key === "description" && "justify-start text-left",
                  isModified && "bg-blue-50",
                  selectedIds.includes(Number(product.id)) && "bg-secondary/30 group-hover:bg-secondary/50",
                )}
                onClick={() => handleClickItem(product)}
              >
                <div className={isSelecting ? "pointer-events-none" : ""}>
                  <ProductTableCell
                    product={product}
                    column={column}
                    options={options}
                    isActive={isActive}
                    isEditMode={isEditMode}
                    onActivate={() => {
                      if (isEditMode && column.editable && !isSelecting) {
                        onActivateCell(product.id, column.key);
                      }
                    }}
                    onCancel={onCancelCell}
                    onChange={(value, arbitraryColumn) => { 
                      // Si se pasa una columna arbitraria, se usa para actualizar el valor de la columna
                      // En este momento solo la uso para pasar originalPrice
                      const columnProp = arbitraryColumn ?? column;
                      
                      onCellChange(product.id, columnProp.key as EditableProductField, value);
                      if (columnProp.type !== "multiselect") {
                        onCancelCell();
                      }
                    }}
                    onLiveChange={(value) => {
                      onCellChange(product.id, column.key as EditableProductField, value);
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
