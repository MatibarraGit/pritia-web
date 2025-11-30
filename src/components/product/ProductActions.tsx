"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { CheckoutButton } from "@/components"
import { cartContext, toastContext } from "@/contexts";
import { ProductType } from "@/types";

interface ProductActionsProps {
  product: ProductType;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = cartContext();
  const { showToast } = toastContext();

  const cartItemProduct = {
    id: product.id,
    image: product.images[0] || "/img/image-icon.png",
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

  const handleAddToCart = () => {
    addToCart(cartItemProduct);
    showToast("Producto agregado al carrito", "success");
  };

  return (
    <div className="-mt-3 space-y-4">
      {/* Cantidad */}
      <div className="flex flex-col items-start gap-2 text-sm text-green-600">
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

      {/* Botones de acción */}
      <div className="w-full flex flex-col space-x-4 gap-2">
        <Button 
          variant="outline"
          className="w-full"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>

        <CheckoutButton items={cartItemProduct} />
      </div>
    </div>
  );
}




