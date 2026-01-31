/* eslint-disable @next/next/no-img-element */
"use client";

import { memo, useMemo } from "react";
import { PointerIcon, PointerOff, Pencil, Power } from "lucide-react";
import { cn } from "@/libs/utils";

import { selectItemsContext } from "@/contexts";
import { Button, Checkbox } from "@/components/ui";
import { ProductType } from "@/types";
import { ACTION_TYPES } from "@/utils";


type SelectionMenu = {
  products: ProductType[]
  handleAction: (action: string, item?: ProductType | null) => void;
};

export const SelectionMenu = memo(({ products, handleAction } : SelectionMenu) => {
  const { isSelecting, toggleSelecting, selectedItems, toggleAllItemsSelection } = selectItemsContext();
  const allSelected = selectedItems.length === products.length && products.length > 0;
  const selectedCount = useMemo(() => selectedItems?.length || 0, [selectedItems]);

  return (
    <>
      {/* Botón flotante para activar/desactivar modo selección */}
      <button
        className={cn(
          "fixed right-6 z-50 size-14 rounded-full shadow-lg transition-all flex items-center justify-center",
          products.length === 0 && "hidden",
          isSelecting
            ? "bg-danger hover:bg-danger-hover text-white bottom-20 "
            : "bg-primary hover:bg-primary-hover text-white bottom-6"
        )}
        onClick={() => toggleSelecting()}
        aria-label={isSelecting ? "Cerrar modo selección" : "Activar modo selección"}
      >
        {isSelecting ? (
          <PointerOff className="size-6" />
        ) : (
          <PointerIcon className="size-6" />
        )}
      </button>

      {/* Menú de selección múltiple */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-[#ffe347] border-t shadow-lg transition-transform duration-300",
          isSelecting ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-11/12 max-w-content mx-auto py-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={() =>
                  toggleAllItemsSelection(products.map((product) => {
                    return { id: product.id, name: product.name, images: product.images, description: product.description, price: product.price };
                  }))
                }
                className="bg-white text-white border-none data-[state=checked]:bg-black transition-colors" 
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

          {/* Botones de acciones */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="border border-green-400 bg-white hover:bg-green-100"
              disabled={selectedCount === 0}
              onClick={() => handleAction(ACTION_TYPES.SHARE)}
            >
              <img src="/icons/whatsapp.svg" alt="Compartir" width={20} height={20} />
            </Button>
        
            <Button
              variant="ghost"
              size="icon"
              className="border border-primary bg-white text-primary hover:bg-primary/20"
              disabled={selectedCount !== 1}
              // onClick={() => handleAction(ACTION_TYPES.UPDATE)}
            >
              <Pencil className="size-5" />
            </Button>
        
            {/* <Button
              variant="ghost"
              size="icon"
              className="border border-danger bg-white text-danger hover:bg-danger/20"
              disabled={selectedCount !== 1}
              // onClick={() => handleAction(ACTION_TYPES.DELETE)}
            >
              <Trash2 className="size-5" />
            </Button> */}
            <Button
              variant="secondary"
              size="icon"
              className="border border-danger bg-white text-danger hover:bg-danger/20"
              disabled={selectedCount !== 1}
              // onClick={() => handleAction(ACTION_TYPES.DISABLE, item)}
            >
              <Power size={18}  />
            </Button>
          </div>

        </div>
      </div>
    </>
  );
});

SelectionMenu.displayName = 'SelectionMenu';