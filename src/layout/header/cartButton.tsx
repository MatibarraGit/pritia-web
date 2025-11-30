"use client";
import { ShoppingCart } from "lucide-react";
import { toastContext, cartContext } from "@/contexts";

export const CartButton = () => {
  const { toggleCart } = toastContext();
  const { items } = cartContext();
  const itemCount = items.length;

  return (
    <div 
      className="p-2 relative left-2 cursor-pointer hover:bg-background-hover rounded-full"
      onClick={toggleCart}
    >
      <div className="relative">
        <ShoppingCart />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
    </div>
  );
};
