"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { EllipsisVertical, Trash2 } from "lucide-react"
import { cn } from "@/libs/utils";

import { lovedProductsContext, LovedProductType, toastContext } from "@/contexts";
import { Button, Checkbox, Popover, PopoverTrigger, PopoverContent } from "@/components/ui";
import { formatDate, formatPrice } from "@/utils";

type ListRowProps = {
  product: LovedProductType;
  handleAddToCart: (product: LovedProductType) => void;
};

const ListHeader = () => {
  return (
    <div className={cn(
      "hidden md:grid gap-4 items-center px-6 py-6 pr-0 border-b shadow-sm rounded-t-lg font-medium text-sm text-muted-foreground bg-background",
      "grid-cols-[10px_2fr_1fr_1fr_1fr] transition-all duration-300"
    )}>
      <div></div>
      <div>Producto</div>
      <div>Precio por unidad</div>
      <div>Fecha de adición</div>
      <div></div>
    </div>
  )
}

const ListRow = memo(({ product, handleAddToCart }: ListRowProps) => {
  const { showToast } = toastContext();
  const { removeLovedProduct } = lovedProductsContext();
  
  const notAvailable = product.inStock === false;

  // Eliminar productos seleccionados de favoritos
  const handleDelete = () => {
    removeLovedProduct(product.id);
    showToast("Producto eliminado de favoritos", "success");
  };

  const image = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/img/image-icon.webp";

  return (
    <div
      key={product.id}
      className={cn(
        "relative flex flex-col gap-4 p-4 bg-background rounded-lg shadow-sm transition-colors",
        "md:bg-transparent md:rounded-none md:shadow-none md:p-4 md:grid md:gap-4 md:items-center md:grid-cols-[auto_2fr_1fr_1fr_1fr] transition-all duration-300",
        notAvailable && "[&>*:not(.notAvailableMessage)]:pointer-events-none [&>*:not(.notAvailableMessage)]:opacity-50"
      )}
    >
      {notAvailable && (
        <div className="notAvailableMessage absolute inset-0 z-20 flex items-start justify-center pt-4 md:pt-20">
          <div className="bg-background px-2 py-1 rounded shadow-md">
            <span className="text-sm text-muted-foreground">
              Producto sin stock
            </span>
          </div>
        </div>
      )}
      

      {/* Imagen y nombre del producto */}
      <Link
        className="flex flex-col items-center gap-2.5 min-w-0 md:flex-row md:items-center md:gap-4"
        href={`/producto/${product.slug}`}
      >
        <div className="relative w-32 h-32 shrink-0 md:w-28 md:h-28">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover rounded"  
          />
        </div>
        <span className="text-sm font-medium capitalize line-clamp-2 text-center md:text-left">
          {product.name}
        </span>
      </Link>

      {/* Precio */}
      <div className="text-sm font-medium text-primary">
        {formatPrice(product.price)}
      </div>

      {/* Fecha de adición */}
      <div className="text-sm text-muted-foreground">
        {product.dateAdded ? formatDate(product.dateAdded).fechaMostrar : "-"}
      </div>

      {/* Botón añadir al carrito */}
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
          disabled={notAvailable}
          className="w-full md:w-auto"
        >
          Añadir al carrito
        </Button>
      </div>

      <div className="absolute right-2 top-4">
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical size={16}  />
          </PopoverTrigger>
          <PopoverContent className="w-32 py-2 px-1 bg-white">
            <Button 
              className="w-full border-none"
              variant="destructive" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 size={16} />
              Eliminar
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

ListRow.displayName = "ListRow";

type LovedProductListProps = {
  handleAddToCart: (product: LovedProductType) => void;
  handleAddAllToCart: () => void;
};

export const LovedProductList = memo(
  ({ handleAddToCart, handleAddAllToCart }: LovedProductListProps) => {
    const { lovedProducts } = lovedProductsContext();

    // Sort by date added (most recent first)
    const sortedProducts = useMemo(() => {
      return [...lovedProducts].sort((a, b) => {
        const dateA = a.dateAdded || "";
        const dateB = b.dateAdded || "";
        return dateB.localeCompare(dateA);
      });
    }, [lovedProducts]);    

    const ListContent = useMemo(() => {
      return sortedProducts.map((product) => (
        <ListRow
          key={product.id}
          product={product}
          handleAddToCart={handleAddToCart}
        />
      ));
    }, [sortedProducts, handleAddToCart]);

    return (
      <>
        <div className="w-11/12 max-w-5xl mx-auto -mt-10 relative z-10 md:mt-0 md:pt-8">
          <div className="grid gap-4 mt-16 md:bg-background md:mt-0 md:rounded-lg md:border md:overflow-hidden">
            <ListHeader />
            <div className="flex flex-col gap-4">
              {ListContent}
            </div>
          </div>
        </div>

        {/* Comprar y Agregar todo al carrito */}
        <div className="w-11/12 max-w-5xl mx-auto py-6 relative z-10 md:pb-8">
          <Button onClick={handleAddAllToCart} variant="primary" size="lg" className="w-full md:w-auto md:ml-auto md:flex">
            Añadir todo al carrito
          </Button>
        </div>
      </>
    );
  }
);

LovedProductList.displayName = "LovedProductList";

