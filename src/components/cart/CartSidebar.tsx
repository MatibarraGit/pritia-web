"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui";
import { toastContext, cartContext } from "@/contexts";
import { cn } from "@/libs/utils";
import { formatPrice } from "@/utils";
import { CartItem } from "./CartItem";

export function CartSidebar() {
  const { isCartOpen, closeCart } = toastContext();
  const { items } = cartContext();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0; // TODO: Implementar cálculo de envío
  const total = subtotal + shipping;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      <aside
        className={cn(
          "w-76 h-full px-4 flex flex-col fixed top-0 right-0 z-50 shadow-xl bg-white sidebar-transition sm:w-96",
          !isCartOpen && "-right-76 sm:-right-96"
        )}
      >
        {/* Title */}
        <div className="py-4 border-b flex items-center justify-between">
          <h2 className="text-lg">Carrito ({items.length})</h2>
          <button
            onClick={closeCart}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {/* Empty cart */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Image
                src="/img/empty-cart.png"
                alt="Carrito vacío"
                width={300}
                height={300}
                className="mx-auto w-48 h-48 object-cover"
              />
              <h3 className="font-medium text-lg mt-4 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-4">
                Agregá productos al carrito para finalizar la compra
              </p>
              <Button
                onClick={closeCart}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Seguir Comprando
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full w-full relative">
              {/* Cart items */}
              <div className="h-4/5 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="py-4 border-b last:border-b-0">
                    <CartItem
                      id={item.id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                      originalPrice={item.originalPrice}
                      quantity={item.quantity}
                      slug={item.slug}
                    />
                  </div>
                ))}
              </div>
              {/* Cart footer */}
              <div className="w-full absolute bottom-0  border-t py-4 bg-white">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>

                  <div className="flex justify-between font-subheading text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  href="/cart"
                >
                  Finalizar compra
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
