"use client";

import { X, Pencil } from "lucide-react";
import { lovedProductsContext, selectItemsContext } from "@/contexts";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/libs/utils";

type MultipleSelectionMenuProps = {
  handleDelete: () => void;
};

export const MultipleSelectionMenu = ({ handleDelete }: MultipleSelectionMenuProps) => {
  const { lovedProducts } = lovedProductsContext();
  const { isSelecting, toggleSelecting, selectedItems, toggleAllItemsSelection } =
    selectItemsContext();

  const allSelected = selectedItems.length === lovedProducts.length && lovedProducts.length > 0;

  return (
    <>
      {/* Botón flotante para activar/desactivar modo selección */}
      <button
        className={cn(
          "fixed right-6 z-50 size-14 rounded-full shadow-lg transition-all flex items-center justify-center",
          lovedProducts.length === 0 && "hidden",
          isSelecting
            ? "bg-danger hover:bg-danger-hover text-white bottom-20 "
            : "bg-primary hover:bg-primary-hover text-white bottom-6"
        )}
        onClick={() => toggleSelecting()}
        aria-label={isSelecting ? "Cerrar modo selección" : "Activar modo selección"}
      >
        {isSelecting ? (
          <X className="size-6" />
        ) : (
          <Pencil className="size-6" />
        )}
      </button>

      {/* Menú de selección múltiple */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg transition-transform duration-300",
          isSelecting ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-11/12 max-w-content mx-auto py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={() =>
                  toggleAllItemsSelection(lovedProducts.map((product) => product.id))
                }
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Seleccionar todos
              </label>
            </div>

            <span className="text-sm text-muted-foreground">
              {selectedItems.length} seleccionados
            </span>
          </div>

          <Button
            variant="destructive"
            size="default"
            disabled={selectedItems.length === 0}
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </>
  );
};

