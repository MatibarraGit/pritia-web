"use client";

import { NoLovedProducts } from "./noLovedProducts";
import {
  cartContext,
  lovedProductsContext,
  toastContext,
} from "@/contexts";
import { LovedProductList } from "@/components";
import { LovedProductType } from "@/contexts";

export default function LovedProductsPage() {
  const { lovedProducts } = lovedProductsContext();
  const hasLovedProducts = lovedProducts.length > 0;
  const { addToCart } = cartContext();
  const { showToast } = toastContext();

  // Agregar un producto al carrito
  const handleAddToCart = (product: LovedProductType) => {
    const cartItem = {
      id: product.id,
      image: product.images[0] || "/img/image-icon.webp",
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      slug: product.slug,
    };
    addToCart(cartItem);
    showToast("Producto añadido al carrito", "success");
  };

  // Agregar todos los productos al carrito
  const handleAddAllToCart = () => {
    lovedProducts.forEach((product) => {
      const cartItem = {
        id: product.id,
        image: product.images[0] || "/img/image-icon.webp",
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        slug: product.slug,
      };
      addToCart(cartItem);
    });
    showToast("Productos añadidos al carrito", "success");
  };

  return (
    <div className="min-h-content bg-background relative">
      <div className="w-full py-8 relative top-0 bg-primary">
        <h1 className="text-2xl text-center text-white">Productos Favoritos</h1>
      </div>

      {hasLovedProducts ? (
        <LovedProductList
          handleAddToCart={handleAddToCart}
          handleAddAllToCart={handleAddAllToCart}
        />    
      ) : (
        <NoLovedProducts />
      )}
    </div>
  );
}

