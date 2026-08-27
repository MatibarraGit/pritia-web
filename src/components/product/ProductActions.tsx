"use client";
// TODO: Agregar lógica de carrito cuando haya checkout

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// import { Button } from "@/components/ui";
import { CheckoutButton } from "@/components"
// import { cartContext, toastContext } from "@/contexts";
import { ProductType } from "@/types";

interface ProductActionsProps {
  product: ProductType;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  // const { addToCart } = cartContext();
  // const { showToast } = toastContext();

  const cartItemProduct = {
    id: product.id,
    image: product.images[0] || "/img/image-icon.webp",
    name: product.name,
    price: product.price,
    quantity: quantity,
    slug: product.slug,
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // const handleAddToCart = () => {
  //   addToCart(cartItemProduct);
  //   showToast("Producto agregado al carrito", "success");
  // };

  return (
    <div className="space-y-2">
      {/* Disponibilidad */}
      {product.inStock ? (
        <div className="w-fit px-3 py-1 mt-4 text-sm text-white rounded-full bg-green-600">
          <span className="mr-2">✓</span>
          <span className="font-medium">En stock</span>
        </div>
      ) : (
        <div className="w-fit px-3 py-1 text-sm text-white rounded-full bg-red-600">
          <span className="mr-2">✗</span>
          <span className="font-medium">Sin stock</span>
        </div>
      )}

      {/* Cantidad */}
      <div className="flex flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span>Cantidad: </span>
          <div className="flex items-center border rounded-md">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-center w-12">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(product.stock > 0 && product.stock < 10) && (
          <div className="flex items-center gap-1.5 text-md font-medium mt-2 px-2 py-1 rounded bg-orange-200 text-orange-800">
            ⚠ ¡Solo queda{product.stock === 1 ? ' 1 unidad!' : `n ${product.stock} unidades!`} 
          </div>
        )}

        {product.stock >= 10 && (
          <div className="text-gray-600">
            {product.stock} disponibles para entrega inmediata
          </div>
        )}

      </div>
      {/* Botones de acción */}
      <div className="w-full mt-6 flex flex-col space-x-4 gap-2">
        <CheckoutButton items={cartItemProduct} />

        {/* <Button 
          variant="outline"
          className="w-full h-12 border-buy text-buy hover:bg-buy-hover/10"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button> */}
      </div>
    </div>
  );
}




