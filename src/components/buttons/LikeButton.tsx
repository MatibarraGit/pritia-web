"use client";

import { Heart } from "lucide-react";
import { toastContext, lovedProductsContext } from "@/contexts";
import { ProductType } from "@/types";
import { cn } from "@/libs/utils";

export const LikeButton = ({ product, classNames }: { product: ProductType, classNames?: string }) => {
  const addLovedProduct = lovedProductsContext((state) => state.addLovedProduct);
  const removeLovedProduct = lovedProductsContext((state) => state.removeLovedProduct);
  const isLoved = lovedProductsContext((state) =>
    state.lovedProducts.some((lovedProduct) => lovedProduct.id === product.id)
  );
  const { showToast } = toastContext();

  const message = isLoved
    ? "Producto eliminado de favoritos"
    : "Producto añadido a favoritos";

  const type = isLoved ? "error" : "success";

  function handleLike() {
    showToast(message, type);
    if (isLoved) {
      removeLovedProduct(product.id);
    } else {
      const dateAdded = new Date(Date.now());
      const dateString = dateAdded.toString();
      addLovedProduct({ ...product, dateAdded: dateString });
    }
  }

  return (
    <button
      className={cn(
        "hover:scale-130 transition-transform",
        classNames
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
    >
      <Heart 
        size={24} 
        className="transition-colors"
        color={isLoved ? "red" : "black"}
        fill={isLoved ? "red" : "transparent"}
      />
    </button>
  );
};
