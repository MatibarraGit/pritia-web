"use client";

import { NoLovedProducts } from "./noLovedProducts";
import {
  cartContext,
  lovedProductsContext,
  selectItemsContext,
  toastContext,
} from "@/contexts";
import { LovedProductList, MultipleSelectionMenu } from "@/components";
import { LovedProductType } from "@/contexts";

export default function LovedProductsPage() {
  const { lovedProducts, removeLovedProduct } = lovedProductsContext();
  const hasLovedProducts = lovedProducts.length > 0;
  const { deleteSelectedItems } = selectItemsContext();
  const { addToCart } = cartContext();
  const { showToast } = toastContext();

  // Eliminar productos seleccionados de favoritos
  const handleDelete = () => {
    deleteSelectedItems(removeLovedProduct);
    showToast("Producto(s) eliminado(s) de favoritos", "success");
  };

  // Agregar un producto al carrito
  const handleAddToCart = (product: LovedProductType) => {
    const cartItem = {
      id: product.id,
      image: product.images[0] || "/img/image-icon.png",
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
        image: product.images[0] || "/img/image-icon.png",
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
      <div className="w-full pb-10 relative top-0 bg-primary">
        <h1 className="p-6 text-2xl text-center text-white">Productos Favoritos</h1>
      </div>

      {hasLovedProducts ? (
        <>
          <MultipleSelectionMenu handleDelete={handleDelete} />
          <LovedProductList
            handleAddToCart={handleAddToCart}
            handleAddAllToCart={handleAddAllToCart}
          />
        </>
      ) : (
        <NoLovedProducts />
      )}
    </div>
  );
}

