import { Check, Loader2, Pencil, RotateCcw, Save, Search, X } from "lucide-react";
import type { FormEvent } from "react";

import { Button, Input } from "@/components/ui";

interface ProductsTableToolbarProps {
  search: string;
  isEditMode: boolean;
  hasPendingChanges: boolean;
  isFlushing: boolean;
  isLoadingOptions: boolean;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  onDiscardChanges: () => void;
  onFlushNow: () => void;
  onToggleEditMode: () => void;
}

export function ProductsTableToolbar({
  search,
  isEditMode,
  hasPendingChanges,
  isFlushing,
  isLoadingOptions,
  onSearch,
  onClearSearch,
  onDiscardChanges,
  onFlushNow,
  onToggleEditMode,
}: ProductsTableToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <form onSubmit={onSearch} className="w-full lg:max-w-md">
        <div className="relative">
          <Input name="search" defaultValue={search} placeholder="Buscar productos..." className="pr-11" />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-2 top-1/2 rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
            style={{ transform: "translateY(-50%)" }}
          >
            <Search size={16} />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {search && (
          <Button type="button" variant="outline" size="sm" onClick={onClearSearch}>
            <X size={16} />
            {search}
          </Button>
        )}

        {hasPendingChanges && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={onDiscardChanges} disabled={isFlushing}>
              <RotateCcw size={16} />
              Descartar
            </Button>
            <Button type="button" size="sm" onClick={onFlushNow} disabled={isFlushing}>
              {isFlushing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Guardar ahora
            </Button>
          </>
        )}

        <div className="hidden lg:inline-flex">
          <Button
            type="button"
            variant={isEditMode ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleEditMode}
            disabled={isFlushing || isLoadingOptions}
          >
            {isEditMode ? <Check size={16} /> : <Pencil size={16} />}
            {isEditMode ? "Modo edición" : "Modo lectura"}
          </Button>
        </div>
      </div>
    </div>
  );
}
