// TODO: Asegurar que se cree la orden correctamente + Integrar Mercado Pago

"use client";

import { toastContext } from "@/contexts";
import { CartItemType } from "@/types";
import { Button } from "@/components/ui";

interface CheckoutButtonProps {
  disableCheckout?: { disable: boolean; message: string };
  items: CartItemType[] | CartItemType ;
}

export const CheckoutButton = ({ disableCheckout, items }: CheckoutButtonProps) => {
  const { showToast } = toastContext()

  function buyNow() {
    let namesAndQuantitys = ''

    if(disableCheckout?.disable === true) {
      showToast(disableCheckout?.message, 'error')
    } else {
      
      if(Array.isArray(items)) {
        namesAndQuantitys = items.map(item => `- ${item.name} (x${item.quantity}) ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/producto/${item.slug}`).join('\n\n');
      } else {
        namesAndQuantitys = `- ${items.name} (x${items.quantity}) ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/producto/${items.slug}`
      }

      const message = `¡Hola! Vengo desde la web y quiero hacer un pedido:\n\n${namesAndQuantitys}\n\n¿Cuándo llegará a mi domicilio?`;

      const urlMessage = `https://wa.me/+5491131738925?text=${encodeURIComponent(message)}`;
      
      // const orderData = { items }
      // handleOrdersActions(ACTION_TYPES.CREATE, { orderData })

      window.open(urlMessage, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <Button
      className="w-full h-12 bg-buy hover:bg-buy-hover text-white" 
      onClick={buyNow}
    >
      Pedir por WhatsApp
    </Button>
  );
};