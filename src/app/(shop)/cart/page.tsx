import type { Metadata } from "next";
import CartPage from "./cartPage";

export const metadata: Metadata = { title: { absolute: "Carrito de compras" } };

export default function CartPageForMetadata() {
  return <CartPage />;
}