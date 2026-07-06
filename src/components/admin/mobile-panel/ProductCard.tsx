/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef } from "react";
import { ImageIcon, Camera } from "lucide-react";
import { EditableField } from "./EditableField";
import type { ProductType, EditableProductField, EditableCellValue } from "@/types";
import { cn } from "@/libs/utils";

type Props = {
  product: ProductType;
  pending: Record<string, { value: unknown; previousValue: unknown }>;
  onChange: (field: EditableProductField, value: EditableCellValue) => void;
};

const merged = (product: ProductType, pending: Record<string, { value: unknown }>): ProductType => ({
  ...product,
  ...Object.fromEntries(
    Object.entries(pending).map(([key, change]) => [key, change.value])
  ),
});

export function ProductCard({ product, pending, onChange }: Props) {
  const view = merged(product, pending);
  const hasChanges = Object.keys(pending).length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange("images", [url]);
  };

  const isDirty = (f: EditableProductField) => f in pending;

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm transition-all",
        hasChanges && "border-amber-400 ring-1 ring-amber-400/50",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono text-muted-foreground">#{product.id}</span>
        {hasChanges && (
          <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            Cambios pendientes
          </span>
        )}
      </div>

      {/* Image */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-input bg-muted transition-all hover:opacity-90",
          isDirty("images") && "border-amber-400 ring-2 ring-amber-400/50",
        )}
      >
        {view.images && view.images.length > 0 ? (
          <img
            src={view.images[0]}
            alt={view.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/60 py-2 text-xs font-medium text-white">
          <Camera className="h-3.5 w-3.5" />
          Cambiar
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </button>

      <div className="space-y-3">
        <EditableField
          kind="text"
          label="Nombre"
          value={view.name}
          isDirty={isDirty("name")}
          onCommit={(v) => onChange("name", v)}
        />
        <EditableField
          kind="textarea"
          label="Descripción"
          value={view.description}
          isDirty={isDirty("description")}
          onCommit={(v) => onChange("description", v)}
        />

        <div className="grid grid-cols-2 gap-3">
          <EditableField
            kind="number"
            label="P/Compra"
            value={view.purchasePrice}
            isDirty={isDirty("purchasePrice")}
            onCommit={(v) => onChange("purchasePrice", v)}
          />
          <EditableField
            kind="number"
            label="P/Venta"
            value={view.price}
            isDirty={isDirty("price")}
            onCommit={(v) => onChange("price", v)}
          />
          <EditableField
            kind="number"
            label="P/Revendedores"
            value={view.resellersPrice || 0}
            isDirty={isDirty("resellersPrice")}
            onCommit={(v) => onChange("resellersPrice", v)}
            className="col-span-2"
          />
        </div>

        <div className="pt-1 text-[10px] text-muted-foreground">
          Actualizado: {view.updatedAt ? new Intl.DateTimeFormat("es-AR").format(new Date(view.updatedAt)) : "N/A"}
        </div>
      </div>
    </article>
  );
}
