import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { ProductType, EditableProductField, EditableCellValue } from "@/types";

type Props = {
  products: ProductType[];
  pendingChanges: Record<number, Record<string, { value: unknown; previousValue: unknown }>>;
  hasPendingChanges: boolean;
  pendingChangeCount: number;
  isFlushing: boolean;
  onFieldChange: (productId: number, field: EditableProductField, value: EditableCellValue) => void;
  onFlushNow: () => void;
  onDiscardChanges: () => void;
};

export function MobileProductPanel({
  products,
  pendingChanges,
  hasPendingChanges,
  pendingChangeCount,
  isFlushing,
  onFieldChange,
  onFlushNow,
  onDiscardChanges,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Banner de cambios pendientes */}
      {hasPendingChanges && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {pendingChangeCount} cambio{pendingChangeCount !== 1 ? "s" : ""} pendiente
          {pendingChangeCount !== 1 ? "s" : ""}
        </div>
      )}

      {/* Lista de productos */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            pending={pendingChanges[product.id] || {}}
            onChange={(field, value) => onFieldChange(product.id, field, value)}
          />
        ))}
      </div>

      {/* Botones de acción */}
      {hasPendingChanges && (
        <div className="sticky bottom-0 flex gap-2 bg-background p-4 shadow-lg">
          <button
            type="button"
            onClick={onDiscardChanges}
            disabled={isFlushing}
            className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onFlushNow}
            disabled={isFlushing}
            className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isFlushing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
