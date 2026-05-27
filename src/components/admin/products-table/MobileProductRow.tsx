/* eslint-disable @next/next/no-img-element */

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/libs/utils";
import type { ProductType } from "@/types";

export function MobileProductRow({ product }: { product: ProductType }) {
  const images = product.images || [];

  return (
    <article className="grid grid-cols-[76px_1fr_auto] items-center gap-3 bg-white p-3">
      <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
        {images.length > 0 ? (
          images.slice(0, 4).map((image) => (
            <img key={image} src={image} alt={product.name} className="h-full w-full object-contain" />
          ))
        ) : (
          <div className="col-span-2 flex h-full items-center justify-center text-xs text-gray-400">
            Sin img.
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">{product.name}</p>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
            product.inStock
              ? "border-yellow-200 bg-yellow-100 text-yellow-800"
              : "border-red-200 bg-red-100 text-red-800"
          )}
        >
          {product.inStock ? "Disponible" : "Agotado"}
        </span>
      </div>

      <Button variant="outline" size="icon" href={`/admin/products/edit/${product.id}`} aria-label={`Editar ${product.name}`}>
        <Pencil size={18} />
      </Button>
    </article>
  );
}
