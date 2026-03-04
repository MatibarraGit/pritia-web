"use server";

import { MercadoPagoInstallment } from "@/types";

// GET - Obtener financiación según precio y tarjeta
export async function fetchFinancingByPriceAndCard({
  price,
  card
}: {
  price: number;
  card: string;
}): Promise<MercadoPagoInstallment[]> {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Falta configurar token de Mercado Pago en el entorno.");
    }

    // La API de payment_methods no filtra por amount en query; el filtrado se hace con min/max del response.
    const response = await fetch(`https://api.mercadopago.com/v1/payment_methods/installments?amount=${price}&payment_method_id=${card}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return [];
    }
    
    return await response.json() as MercadoPagoInstallment[];
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    return [];
  }
}



