// TODO: Poner las tarjetas aceptadas
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui";
import { CheckoutButton } from "@/components";
import { toastContext, cartContext } from "@/contexts";
import { formatPrice } from "@/utils";
import { CartItem } from "@/components/cart/CartItem";

export default function CartPage() {
  const { isCartOpen, closeCart } = toastContext();
  const { items: cartItems } = cartContext();

  // Cerrar el carrito al entrar en la página
  useEffect(() => {
    if (isCartOpen) {
      closeCart();
    }
  }, []);

  // Costos
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="w-11/12 max-w-content py-8 mx-auto">
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden p-2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-subheading">Productos</TableHead>
                  </TableRow>
                  {cartItems.map((item, idx) => (
                    <TableRow key={item.id} className="border-none">
                      <TableCell
                        colSpan={2}
                        className={`py-6 ${idx !== cartItems.length - 1 ? "border-b" : ""}`}
                      >
                        <CartItem
                          id={item.id}
                          image={item.image}
                          name={item.name}
                          price={item.price}
                          originalPrice={item.originalPrice}
                          quantity={item.quantity}
                          slug={item.slug}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              variant="outline"
              href="/products"
              className="mt-4 bg-white"
            >
              Seguir comprando
            </Button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <h2 className="py-2 text-lg text-center font-subheading rounded-t-lg shadow bg-black/5">
              Resumen de compra
            </h2>

            <div className="bg-white rounded-b-lg shadow p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-green-600 font-medium">{shipping ? formatPrice(shipping) : 'Gratis'}</span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-subheading text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <CheckoutButton disableCheckout={{ disable: cartItems.length === 0, message: 'El carrito está vacío' }} items={cartItems} />

              <div className="mt-6">
                <div className="text-center text-sm text-gray-500">
                  <p>
                    Aceptamos todas las principales tarjetas de crédito y débito
                  </p>
                </div>

                <div className="flex justify-center gap-2 mt-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-6xl">🛒</span>
          </div>
          <h2 className="text-xl font-medium mt-4">Tu carrito está vacío</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Parece que aún no has añadido ningún producto a tu carrito
          </p>
            <Button
              variant="outline"
              href="/products"
              className="mt-4 bg-white"
            >
              Seguir comprando
            </Button>
        </div>
      )}
    </div>
  );
};
