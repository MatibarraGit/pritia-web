"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { lovedProductsContext } from "@/contexts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatPrice } from "@/utils";
import { cn } from "@/libs/utils";

export const FavouritesMenu = () => {
  const { lovedProducts } = lovedProductsContext();
  const [open, setOpen] = useState(false);
  
  // Sort by date added (most recent first)
  const sortedProducts = [...lovedProducts].sort((a, b) => {
    const dateA = a.dateAdded || "";
    const dateB = b.dateAdded || "";
    return dateB.localeCompare(dateA);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="p-2 relative left-2 cursor-pointer hover:bg-background-hover rounded-full">
          <Heart className="size-6" />
          {lovedProducts.length > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {lovedProducts.length > 99 ? "99+" : lovedProducts.length}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        sideOffset={8}
        className="w-[300px] p-0 bg-background"
      >
        {sortedProducts.length === 0 ? (
          <div className="text-sm p-3 text-center text-muted-foreground bg-background">
            Todavía no hay productos en tus favoritos
          </div>
        ) : (
          <>
            <div className="max-h-[250px] overflow-y-auto personalized-scrollbar bg-background">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex gap-2.5 p-2.5 hover:bg-background-hover transition-colors",
                    "first:pt-2.5"
                  )}
                >
                  <Image
                    src={
                      product.images && product.images.length >= 1
                        ? product.images[0]
                        : "/img/image-icon.png"
                    }
                    alt={product.name}
                    width={60}
                    height={60}
                    className="object-cover rounded shrink-0"
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm leading-tight capitalize line-clamp-2">
                      {product.name}
                    </span>
                    <div className="text-sm font-medium text-primary">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t p-2 flex items-center justify-center shadow-[0_-1px_8px_rgba(0,0,0,0.1)] bg-background rounded-b-lg">
              <Link
                href="/loved-products"
                onClick={() => setOpen(false)}
                className="text-sm text-primary hover:underline w-full text-center"
              >
                Ir a la página de favoritos
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

